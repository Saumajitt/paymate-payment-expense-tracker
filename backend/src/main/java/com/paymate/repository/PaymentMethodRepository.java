package com.paymate.repository;

import com.paymate.model.PaymentMethod;
import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    
    List<PaymentMethod> findByUserOrderByCreatedAtDesc(User user);
    
    List<PaymentMethod> findByUserAndIsDefaultTrue(User user);
}
