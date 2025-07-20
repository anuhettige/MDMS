package com.mpma.dms.service;

import com.mpma.dms.dto.DocumentDTO;
import com.mpma.dms.dto.StudentDTO;

import java.io.IOException;
import java.util.List;

public interface StudentService {


    StudentDTO getStudentById(Long id);
    List<StudentDTO> getStudents();

    byte[] generateCertificate(Long id) throws IOException;
}
