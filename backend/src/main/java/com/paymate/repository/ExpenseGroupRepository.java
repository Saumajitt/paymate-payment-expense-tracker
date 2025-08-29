package com.paymate.repository;

import com.paymate.model.ExpenseGroup;
import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseGroupRepository extends JpaRepository<ExpenseGroup, Long> {
    
    List<ExpenseGroup> findByCreatedByOrderByCreatedAtDesc(User createdBy);
    
    @Query("SELECT g FROM ExpenseGroup g JOIN g.members m WHERE m = :user ORDER BY g.createdAt DESC")
    List<ExpenseGroup> findGroupsByMember(@Param("user") User user);
    
    @Query("SELECT g FROM ExpenseGroup g WHERE g.createdBy = :user OR :user MEMBER OF g.members ORDER BY g.createdAt DESC")
    List<ExpenseGroup> findUserGroups(@Param("user") User user);
}
