package com.paymate.repository;

import com.paymate.model.Transaction;
import com.paymate.model.TransactionStatus;
import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findBySenderOrReceiverOrderByCreatedAtDesc(User sender, User receiver);
    
    List<Transaction> findBySenderAndStatusOrderByCreatedAtDesc(User sender, TransactionStatus status);
    
    List<Transaction> findByReceiverAndStatusOrderByCreatedAtDesc(User receiver, TransactionStatus status);
    
    List<Transaction> findBySenderAndReceiverOrderByCreatedAtDesc(User sender, User receiver);
    
    @Query("SELECT t FROM Transaction t WHERE (t.sender = :user OR t.receiver = :user) AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findUserTransactionsBetweenDates(@Param("user") User user, 
                                                      @Param("startDate") LocalDateTime startDate, 
                                                      @Param("endDate") LocalDateTime endDate);
    
    List<Transaction> findByPaymentIntentId(String paymentIntentId);
}
