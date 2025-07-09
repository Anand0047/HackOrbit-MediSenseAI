//package com.hackOrbit.mediSense.Chat;
//
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.OutputStream;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/symptoms")
//@CrossOrigin(origins = "http://localhost:5173")
//@RequiredArgsConstructor
//public class SymptomReportController {
//
//    private final SymptomReportService reportService;
//    private final SymptomReportRepository reportRepository;
//
//    /**
//     * Save a new symptom report (up to 5 per user)
//     */
//    @PostMapping("/report")
//    public ResponseEntity<SymptomReport> submitSymptomReport(@RequestBody SymptomReport report) {
//        SymptomReport savedReport = reportService.saveReport(report);
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
//    }
//
//    @GetMapping("/report/{id}")
//    public ResponseEntity<?> getReportById(@PathVariable Long id) {
//        Optional<SymptomReport> optionalReport = reportRepository.findById(id);
//        if (optionalReport.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Report not found");
//        }
//
//        SymptomReport report = optionalReport.get();
//        String userEmail = getCurrentUserEmail();
//
//        // Restrict access to only the report owner
//        if (!report.getUser().getEmail().equals(userEmail)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
//        }
//
//        return ResponseEntity.ok(report);
//    }
//
//
//    /**
//     * Get the last 5 symptom reports of the logged-in user
//     */
//    @GetMapping("/reports")
//    public ResponseEntity<List<SymptomReport>> getMyReports() {
//        List<SymptomReport> reports = reportService.getMyLatestReports();
//        return ResponseEntity.ok(reports);
//    }
//
//    /**
//     * Download a single report as a plain PDF
//     */
//    @GetMapping("/report/{id}/download")
//    public void downloadReport(@PathVariable Long id, HttpServletResponse response) {
//        Optional<SymptomReport> optionalReport = reportRepository.findById(id);
//        if (optionalReport.isEmpty()) {
//            response.setStatus(HttpStatus.NOT_FOUND.value());
//            return;
//        }
//
//        SymptomReport report = optionalReport.get();
//        String userEmail = getCurrentUserEmail();
//
//        // Allow download only if the report belongs to the logged-in user
//        if (!report.getUser().getEmail().equals(userEmail)) {
//            response.setStatus(HttpStatus.UNAUTHORIZED.value());
//            return;
//        }
//
//        try {
//            response.setContentType("application/pdf");
//            response.setHeader("Content-Disposition", "attachment; filename=SymptomReport-" + report.getId() + ".pdf");
//
//            OutputStream out = response.getOutputStream();
//            generatePdf(report, out);
//            out.close();
//        } catch (Exception e) {
//            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
//        }
//    }
//
//    private String getCurrentUserEmail() {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        if (principal instanceof UserDetails userDetails) {
//            return userDetails.getUsername();
//        } else {
//            return principal.toString();
//        }
//    }
//
//    /**
//     * Minimal PDF generator using plain text. You can improve it using iText, Apache PDFBox, etc.
//     */
//    private void generatePdf(SymptomReport report, OutputStream out) throws Exception {
//        StringBuilder content = new StringBuilder();
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
//
//        content.append("---- MediSense AI - Symptom Report ----\n\n");
//        content.append("Name: ").append(report.getUser().getName()).append("\n");
//        content.append("Email: ").append(report.getUser().getEmail()).append("\n");
//        content.append("Date: ").append(report.getCreatedAt().format(formatter)).append("\n\n");
//
//        content.append("Symptoms: ").append(report.getSymptoms()).append("\n\n");
//        content.append("Severity: ").append(report.getSeverity()).append("\n");
//        content.append("Summary: ").append(report.getSummary()).append("\n\n");
//
//        content.append("Recommendation: ").append(safe(report.getRecommendation())).append("\n\n");
//        content.append("Specialist: ").append(safe(report.getSpecialist())).append("\n");
//        content.append("Home Care: ").append(safe(report.getHomeCare())).append("\n");
//
//        byte[] bytes = content.toString().getBytes();
//        out.write(bytes);
//    }
//
//    private String safe(String value) {
//        return value != null ? value : "N/A";
//    }
//
//}
