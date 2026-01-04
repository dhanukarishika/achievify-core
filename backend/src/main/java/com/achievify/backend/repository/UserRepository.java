package com.achievify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.achievify.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
