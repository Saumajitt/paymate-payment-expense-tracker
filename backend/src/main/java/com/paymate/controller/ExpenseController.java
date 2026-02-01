package com.paymate.controller;

import com.paymate.dto.CreateExpenseRequest;
import com.paymate.dto.ExpenseResponse;
import com.paymate.security.UserPrincipal;
import com.paymate.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody CreateExpenseRequest request,
                                         Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            ExpenseResponse response = expenseService.createExpense(request, userPrincipal.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating expense: " + e.getMessage());
        }
    }

    @GetMapping("/my-expenses")
    public ResponseEntity<List<ExpenseResponse>> getUserExpenses(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<ExpenseResponse> expenses = expenseService.getUserExpenses(userPrincipal.getId());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseResponse>> getGroupExpenses(@PathVariable Long groupId) {
        List<ExpenseResponse> expenses = expenseService.getGroupExpenses(groupId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/{expenseId}/settle")
    public ResponseEntity<?> settleExpense(@PathVariable Long expenseId,
                                         Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            expenseService.settleExpense(expenseId, userPrincipal.getId());
            return ResponseEntity.ok("Expense settled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error settling expense: " + e.getMessage());
        }
    }
}
