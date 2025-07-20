package com.mpma.dms.controller;

import com.mpma.dms.dto.DocumentDTO;
import com.mpma.dms.dto.StudentDTO;
import com.mpma.dms.service.DocumentService;
import com.mpma.dms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<StudentDTO> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping
//    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<StudentDTO>> getStudentsByStudentId() {
        return ResponseEntity.ok(studentService.getStudents());
    }


    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{id}/certificate")
//    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> generateCertificate(@PathVariable Long id) throws IOException {
        return ResponseEntity.ok(studentService.generateCertificate(id));
    }
}
