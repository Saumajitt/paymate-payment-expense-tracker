package com.paymate.repository;

import com.paymate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByPhoneNumber(String phoneNumber);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name% OR u.email LIKE %:name%")
    List<User> findByNameOrEmail(@Param("name") String name);
    
    @Query("SELECT u FROM User u WHERE u.id IN :userIds")
    List<User> findByIdIn(@Param("userIds") List<Long> userIds);
}
