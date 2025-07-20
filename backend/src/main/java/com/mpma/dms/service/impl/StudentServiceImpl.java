package com.mpma.dms.service.impl;

import com.mpma.dms.service.StudentService;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.mpma.dms.dto.StudentDTO;
import com.mpma.dms.entity.Student;
import com.mpma.dms.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    @Override
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return mapToDTO(student);
    }

    @Override
    public List<StudentDTO> getStudents() {
        List<Student> student = studentRepository.findAll();
        return student.stream()
                .map(this::mapToDTO).toList();
    }

    @Override
    public byte[] generateCertificate(Long id) throws IOException {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if(studentOptional.isPresent()){
            Student student = studentOptional.get();
            String htmlContent = getHtmlFileAsString();
            htmlContent = htmlContent.replace("[FULLNAME]", student.getFullName());
            htmlContent = htmlContent.replace("[NIC]", student.getNic());
            return convertHtmlToPdf(htmlContent);
        }
        return new byte[0];
    }

    private static byte[] convertHtmlToPdf(String htmlContent) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            // Use PdfRendererBuilder to render HTML content to PDF
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            // Return the PDF as byte array
            return outputStream.toByteArray();

        } catch (Exception e) {
            System.err.println("An error occurred while generating the PDF - " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String getHtmlFileAsString() throws IOException {
        // Get the input stream for the file in resources/static/index.html
        try (InputStream inputStream = StudentServiceImpl.class.getClassLoader()
                .getResourceAsStream("static/index.html")) {

            if (inputStream == null) {
                throw new IOException("File not found in resources/static/index.html");
            }

            // Read all bytes and convert to String
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        BeanUtils.copyProperties(student, dto);
        return dto;
    }
}
