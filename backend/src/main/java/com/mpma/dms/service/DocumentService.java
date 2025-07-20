package com.mpma.dms.service;

import com.mpma.dms.dto.DocumentDTO;
import java.util.List;

public interface DocumentService {
    DocumentDTO createDocument(DocumentDTO documentDTO);
    DocumentDTO getDocumentById(Long id);
    List<DocumentDTO> getDocumentsByStudentId(String studentId);
    DocumentDTO updateDocument(Long id, DocumentDTO documentDTO);
    void deleteDocument(Long id);
}
