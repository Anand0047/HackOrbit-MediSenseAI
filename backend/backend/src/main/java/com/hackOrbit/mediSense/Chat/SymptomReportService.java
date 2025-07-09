package com.hackOrbit.mediSense.Chat;

import com.hackOrbit.mediSense.Auth.model.User;
import com.hackOrbit.mediSense.Auth.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SymptomReportService {

    private final SymptomReportRepository reportRepository;
    private final UserRepository userRepository;

    public SymptomReport saveReport(SymptomReport reportData) {
        String currentUserEmail = getLoggedInUserEmail();
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long count = reportRepository.countByUser(user);

        if (count >= 5) {
            List<SymptomReport> oldReports = reportRepository.findAllByUserOrderByCreatedAtAsc(user);
            reportRepository.delete(oldReports.get(0));
        }

        reportData.setUser(user);
        reportData.setCreatedAt(LocalDateTime.now());
        reportRepository.save(reportData);
        return reportData;
    }

    public List<SymptomReport> getMyLatestReports() {
        String currentUserEmail = getLoggedInUserEmail();
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reportRepository.findTop5ByUserOrderByCreatedAtDesc(user);
    }


    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        } else {
            return principal.toString(); // can fallback to raw principal
        }
    }
}
