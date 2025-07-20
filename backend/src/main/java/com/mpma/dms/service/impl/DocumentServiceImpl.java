package com.mpma.dms.service.impl;



import com.mpma.dms.dto.DocumentDTO;
import com.mpma.dms.entity.Document;
import com.mpma.dms.repository.DocumentRepository;
import com.mpma.dms.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;

    @Override
    public DocumentDTO createDocument(DocumentDTO documentDTO) {
        Document document = Document.builder()
                .studentId(documentDTO.getStudentId())
                .documentName(documentDTO.getDocumentName())
                .documentType(documentDTO.getDocumentType())
                .documentUrl(documentDTO.getDocumentUrl())
                .build();
        Document saved = documentRepository.save(document);
        return mapToDTO(saved);
    }

    @Override
    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
        return mapToDTO(document);
    }

    @Override
    public List<DocumentDTO> getDocumentsByStudentId(String studentId) {
        List<Document> documents = documentRepository.findByStudentId(studentId);
        return documents.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO updateDocument(Long id, DocumentDTO documentDTO) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));

        document.setDocumentName(documentDTO.getDocumentName());
        document.setDocumentType(documentDTO.getDocumentType());
        document.setDocumentUrl(documentDTO.getDocumentUrl());

        Document updated = documentRepository.save(document);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document not found with ID: " + id);
        }
        documentRepository.deleteById(id);
    }

    private DocumentDTO mapToDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        BeanUtils.copyProperties(document, dto);
        return dto;
    }
}
