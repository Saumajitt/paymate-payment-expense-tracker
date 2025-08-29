package com.paymate.repository;

import com.paymate.model.Expense;
import com.paymate.model.ExpenseStatus;
import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByPaidByOrderByCreatedAtDesc(User paidBy);
    
    List<Expense> findByStatusOrderByCreatedAtDesc(ExpenseStatus status);
    
    @Query("SELECT e FROM Expense e JOIN e.participants p WHERE p.user = :user ORDER BY e.createdAt DESC")
    List<Expense> findExpensesByParticipant(@Param("user") User user);
    
    @Query("SELECT e FROM Expense e WHERE e.group.id = :groupId ORDER BY e.createdAt DESC")
    List<Expense> findByGroupIdOrderByCreatedAtDesc(@Param("groupId") Long groupId);
}
