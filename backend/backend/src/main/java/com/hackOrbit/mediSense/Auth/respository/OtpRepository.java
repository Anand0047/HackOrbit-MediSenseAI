package com.hackOrbit.mediSense.Auth.respository;

import com.hackOrbit.mediSense.Auth.model.Otp;
import com.hackOrbit.mediSense.Auth.model.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndType(String email, OtpType type);
    void deleteByEmailAndType(String email, OtpType type);
}
