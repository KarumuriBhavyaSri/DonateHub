package com.donation.controller;

import com.donation.dto.Dtos;
import com.donation.entity.User;
import com.donation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.donation.service.OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new com.donation.dto.ApiResponse<>(400, "Email is required", null));
        }
        otpService.generateOtp(email);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "OTP sent to console", null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody java.util.Map<String, Object> request) {
        try {
            String otp = (String) request.get("otp");
            String email = (String) request.get("email");

            if (otp == null || !otpService.validateOtp(email, otp)) {
                return ResponseEntity.badRequest()
                        .body(new com.donation.dto.ApiResponse<>(400, "Invalid or expired OTP", null));
            }

            // Map request to RegisterRequest DTO manually for simplicity since we
            // simplified things
            Dtos.RegisterRequest registerRequest = new Dtos.RegisterRequest();
            registerRequest.setEmail(email);
            registerRequest.setFullName((String) request.get("fullName"));
            registerRequest.setPassword((String) request.get("password"));
            registerRequest.setPhone((String) request.get("phone"));
            registerRequest.setAddress((String) request.get("address"));
            registerRequest.setRole(com.donation.enums.Role.valueOf((String) request.get("role")));
            
            // Map detailed address fields
            registerRequest.setHouseNumber((String) request.get("houseNumber"));
            registerRequest.setStreetLandmark((String) request.get("streetLandmark"));
            registerRequest.setAreaLocality((String) request.get("areaLocality"));
            registerRequest.setCity((String) request.get("city"));
            registerRequest.setDistrict((String) request.get("district"));
            registerRequest.setState((String) request.get("state"));
            registerRequest.setPincode((String) request.get("pincode"));
            registerRequest.setCountry((String) request.get("country"));
            
            if(com.donation.enums.Role.RECEIVER.equals(registerRequest.getRole())) {
                registerRequest.setGovtCertificationId((String) request.get("govtCertificationId"));
                registerRequest.setOrganizationName((String) request.get("organizationName"));
                registerRequest.setRunnerName((String) request.get("runnerName"));
            }

            User user = userService.register(registerRequest);
            return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Registration successful", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new com.donation.dto.ApiResponse<>(400, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dtos.LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            User user = userService.login(request);
            System.out.println("Login successful for: " + user.getEmail());
            return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Login successful", user));
        } catch (RuntimeException e) {
            System.err.println("Login failed for: " + request.getEmail() + " - " + e.getMessage());
            return ResponseEntity.status(401).body(new com.donation.dto.ApiResponse<>(401, e.getMessage(), null));
        }
    }
}
