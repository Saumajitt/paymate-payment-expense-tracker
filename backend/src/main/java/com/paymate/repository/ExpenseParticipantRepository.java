package com.paymate.repository;

import com.paymate.model.Expense;
import com.paymate.model.ExpenseParticipant;
import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant, Long> {
    
    List<ExpenseParticipant> findByExpense(Expense expense);
    
    List<ExpenseParticipant> findByUser(User user);
    
    List<ExpenseParticipant> findByExpenseAndUser(Expense expense, User user);
}
