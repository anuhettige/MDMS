package com.mpma.dms.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileInfoDTO {
    private String name;
    private long size;
    private String type; // e.g., pdf, folder, etc.
    private OffsetDateTime lastModified;
    private boolean folder; // not `isFolder` to match setter/getter naming convention
}
