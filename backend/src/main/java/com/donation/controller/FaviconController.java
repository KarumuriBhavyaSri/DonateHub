package com.donation.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;

@RestController
public class FaviconController {

    @GetMapping(value = "/favicon.ico", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getFavicon(HttpServletRequest request) {
        try {
            // Try to load favicon from classpath
            InputStream inputStream = getClass().getResourceAsStream("/static/favicon.ico");
            if (inputStream == null) {
                inputStream = getClass().getClassLoader().getResourceAsStream("favicon.ico");
            }
            
            if (inputStream != null) {
                byte[] faviconBytes = StreamUtils.copyToByteArray(inputStream);
                inputStream.close();
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(faviconBytes);
            }
            
            // If no favicon found, return 204 No Content
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
