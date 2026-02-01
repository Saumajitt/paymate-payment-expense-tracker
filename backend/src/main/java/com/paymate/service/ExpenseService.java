package com.paymate.service;

import com.paymate.dto.CreateExpenseRequest;
import com.paymate.dto.ExpenseResponse;
import com.paymate.model.*;
import com.paymate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseGroupRepository expenseGroupRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, Long userId) {
        User paidBy = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(request.getTotalAmount());
        expense.setPaidBy(paidBy);
        expense.setSplitType(request.getSplitType());

        if (request.getGroupId() != null) {
            ExpenseGroup group = expenseGroupRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            expense.setGroup(group);
        }

        expense = expenseRepository.save(expense);

        // Create expense participants
        createExpenseParticipants(expense, request);

        // Create transactions for each participant
        createExpenseTransactions(expense);

        return convertToExpenseResponse(expense);
    }

    private void createExpenseParticipants(Expense expense, CreateExpenseRequest request) {
        List<User> participants = userRepository.findByIdIn(request.getParticipantIds());

        switch (expense.getSplitType()) {
            case EQUAL:
                createEqualSplit(expense, participants);
                break;
            case PERCENTAGE:
                createPercentageSplit(expense, participants, request.getPercentages());
                break;
            case EXACT_AMOUNT:
                createExactAmountSplit(expense, participants, request.getExactAmounts());
                break;
            case SHARES:
                createSharesSplit(expense, participants, request.getShares());
                break;
        }
    }

    private void createEqualSplit(Expense expense, List<User> participants) {
        BigDecimal amountPerPerson = expense.getTotalAmount()
                .divide(new BigDecimal(participants.size()), 2, RoundingMode.HALF_UP);

        for (User participant : participants) {
            ExpenseParticipant expenseParticipant = new ExpenseParticipant();
            expenseParticipant.setExpense(expense);
            expenseParticipant.setUser(participant);
            expenseParticipant.setOwedAmount(amountPerPerson);
            expense.getParticipants().add(expenseParticipant);
        }
    }

    private void createPercentageSplit(Expense expense, List<User> participants, List<BigDecimal> percentages) {
        for (int i = 0; i < participants.size(); i++) {
            User participant = participants.get(i);
            BigDecimal percentage = percentages.get(i);
            BigDecimal owedAmount = expense.getTotalAmount()
                    .multiply(percentage)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            ExpenseParticipant expenseParticipant = new ExpenseParticipant();
            expenseParticipant.setExpense(expense);
            expenseParticipant.setUser(participant);
            expenseParticipant.setOwedAmount(owedAmount);
            expenseParticipant.setPercentage(percentage);
            expense.getParticipants().add(expenseParticipant);
        }
    }

    private void createExactAmountSplit(Expense expense, List<User> participants, List<BigDecimal> exactAmounts) {
        for (int i = 0; i < participants.size(); i++) {
            User participant = participants.get(i);
            BigDecimal owedAmount = exactAmounts.get(i);

            ExpenseParticipant expenseParticipant = new ExpenseParticipant();
            expenseParticipant.setExpense(expense);
            expenseParticipant.setUser(participant);
            expenseParticipant.setOwedAmount(owedAmount);
            expense.getParticipants().add(expenseParticipant);
        }
    }

    private void createSharesSplit(Expense expense, List<User> participants, List<Integer> shares) {
        int totalShares = shares.stream().mapToInt(Integer::intValue).sum();

        for (int i = 0; i < participants.size(); i++) {
            User participant = participants.get(i);
            Integer userShares = shares.get(i);
            BigDecimal owedAmount = expense.getTotalAmount()
                    .multiply(new BigDecimal(userShares))
                    .divide(new BigDecimal(totalShares), 2, RoundingMode.HALF_UP);

            ExpenseParticipant expenseParticipant = new ExpenseParticipant();
            expenseParticipant.setExpense(expense);
            expenseParticipant.setUser(participant);
            expenseParticipant.setOwedAmount(owedAmount);
            expenseParticipant.setShares(userShares);
            expense.getParticipants().add(expenseParticipant);
        }
    }

    private void createExpenseTransactions(Expense expense) {
        for (ExpenseParticipant participant : expense.getParticipants()) {
            // Skip creating transaction for the person who paid
            if (participant.getUser().getId().equals(expense.getPaidBy().getId())) {
                participant.setStatus(ParticipantStatus.PAID);
                participant.setPaidAmount(participant.getOwedAmount());
                continue;
            }

            Transaction transaction = new Transaction();
            transaction.setSender(participant.getUser());
            transaction.setReceiver(expense.getPaidBy());
            transaction.setAmount(participant.getOwedAmount());
            transaction.setType(TransactionType.EXPENSE_SPLIT);
            transaction.setStatus(TransactionStatus.PENDING);
            transaction.setDescription("Payment for: " + expense.getTitle());
            transaction.setExpense(expense);

            transactionRepository.save(transaction);
        }
    }

    public List<ExpenseResponse> getUserExpenses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findExpensesByParticipant(user);
        return expenses.stream()
                .map(this::convertToExpenseResponse)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getGroupExpenses(Long groupId) {
        List<Expense> expenses = expenseRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
        return expenses.stream()
                .map(this::convertToExpenseResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void settleExpense(Long expenseId, Long participantUserId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        ExpenseParticipant participant = expense.getParticipants().stream()
                .filter(p -> p.getUser().getId().equals(participantUserId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setStatus(ParticipantStatus.PAID);
        participant.setPaidAmount(participant.getOwedAmount());

        // Update related transaction
        List<Transaction> transactions = transactionRepository.findBySenderAndReceiverOrderByCreatedAtDesc(
                participant.getUser(), expense.getPaidBy());
        
        transactions.stream()
                .filter(t -> t.getExpense() != null && t.getExpense().getId().equals(expenseId))
                .findFirst()
                .ifPresent(transaction -> {
                    transaction.setStatus(TransactionStatus.COMPLETED);
                    transactionRepository.save(transaction);
                });

        // Check if all participants have paid
        boolean allPaid = expense.getParticipants().stream()
                .allMatch(p -> p.getStatus() == ParticipantStatus.PAID);

        if (allPaid) {
            expense.setStatus(ExpenseStatus.SETTLED);
        } else {
            expense.setStatus(ExpenseStatus.PARTIALLY_SETTLED);
        }

        expenseRepository.save(expense);
    }

    private ExpenseResponse convertToExpenseResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setTitle(expense.getTitle());
        response.setDescription(expense.getDescription());
        response.setTotalAmount(expense.getTotalAmount());
        response.setPaidByName(expense.getPaidBy().getFullName());
        response.setSplitType(expense.getSplitType());
        response.setStatus(expense.getStatus());
        response.setCreatedAt(expense.getCreatedAt());
        
        if (expense.getGroup() != null) {
            response.setGroupName(expense.getGroup().getName());
        }
        
        return response;
    }
}
