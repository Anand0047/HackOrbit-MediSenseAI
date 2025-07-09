package com.hackOrbit.mediSense.Chat;
import com.hackOrbit.mediSense.Auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymptomReportRepository extends JpaRepository<SymptomReport, Long> {

    // Get last 5 reports by the user, ordered by most recent first
    List<SymptomReport> findTop5ByUserOrderByCreatedAtDesc(User user);

    // Count how many reports a user currently has
    long countByUser(User user);

    // Find all reports for a user ordered by createdAt ASC (for deleting oldest)
    List<SymptomReport> findAllByUserOrderByCreatedAtAsc(User user);
}

