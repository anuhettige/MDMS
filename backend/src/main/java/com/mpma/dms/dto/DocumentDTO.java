package com.mpma.dms.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private Long id;
    private String studentId;
    private String documentName;
    private String documentType;
    private String documentUrl;
}
