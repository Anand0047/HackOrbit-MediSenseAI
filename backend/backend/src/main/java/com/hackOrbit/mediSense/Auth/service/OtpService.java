package com.hackOrbit.mediSense.Auth.service;

import com.hackOrbit.mediSense.Auth.model.Otp;
import com.hackOrbit.mediSense.Auth.model.OtpType;
import com.hackOrbit.mediSense.Auth.respository.OtpRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;

    public OtpService(OtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    @Transactional
    public String generateOtp(String email, OtpType type){

        //Clear Existing Otp for the given email and type first
        otpRepository.deleteByEmailAndType(email, type);

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        Otp otpEntity = Otp.builder()
                .email(email)
                .otp(otp)
                .expiryTime(expiryTime)
                .type(type)
                .build();

        otpRepository.save(otpEntity);

        return otp;
    }

    public boolean verifyOtp(String email, String otp, OtpType type){
        Optional<Otp> otpRecord = otpRepository.findByEmailAndType(email, type);

        if(otpRecord.isEmpty()){
            return false;
        }

        Otp storedOtp = otpRecord.get();

        return storedOtp.getOtp().equals(otp) && LocalDateTime.now().isBefore(storedOtp.getExpiryTime());
    }

    @Transactional
    public void clearOtp(String email, OtpType type){
        otpRepository.deleteByEmailAndType(email,type);
    }
}
