package com.mpma.dms.controller;

import com.mpma.dms.dto.FileInfoDTO;
import com.mpma.dms.service.impl.AzureStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    private final AzureStorageService storageService;

    // ✅ Upload to subfolder: /upload/user-1/folder1/my-document.pdf
    @PostMapping("/upload/{userId}/**")
    public ResponseEntity<String> uploadFile(HttpServletRequest request,
                                             @RequestParam("file") MultipartFile file,
                                             @PathVariable String userId) {
        try {
            String fullPath = request.getRequestURI()
                    .split("/upload/" + userId + "/")[1];

            String blobPath = userId + "/" + fullPath;

            storageService.uploadFile(file, blobPath);

            return ResponseEntity.ok("File uploaded to: " + blobPath);
        } catch (IOException | ArrayIndexOutOfBoundsException e) {
            return ResponseEntity.status(500).body("Upload failed");
        }
    }

    // ✅ Download: /download/user-1/folder1/my-document.pdf
    @GetMapping("/download/{userId}/**")
    public ResponseEntity<byte[]> download(HttpServletRequest request,
                                           @PathVariable String userId) throws IOException {
        String fullPath = request.getRequestURI().split("/download/" + userId + "/")[1];
        String blobPath = userId + "/" + fullPath;

        byte[] data = storageService.downloadFile(blobPath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + extractFilename(fullPath))
                .body(data);
    }

    // ✅ List files under user folder or subfolder
    @GetMapping({"/list/{userId}", "/list/{userId}/"})
    public ResponseEntity<List<FileInfoDTO>> listFiles(
            @PathVariable String userId,
            @RequestParam(required = false) String folder) {

        String prefix = (folder != null && !folder.isBlank())
                ? userId + "/" + folder + "/"
                : userId + "/";

        List<FileInfoDTO> files = storageService.listUserFilesWithMetadata(prefix);
        return ResponseEntity.ok(files);
    }

    // ✅ Delete: /delete/user-1/folder1/my-document.pdf
    @DeleteMapping("/delete/{userId}/**")
    public ResponseEntity<String> deleteFile(HttpServletRequest request,
                                             @PathVariable String userId) {
        try {
            String fullPath = request.getRequestURI()
                    .split("/delete/" + userId + "/")[1];
            String blobPath = userId + "/" + fullPath;

            storageService.deleteFile(blobPath);
            return ResponseEntity.ok("Deleted: " + blobPath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Delete failed");
        }
    }

    @DeleteMapping("/delete-folder/{userId}/**")
    public ResponseEntity<String> deleteFolder(HttpServletRequest request,
                                               @PathVariable String userId) {
        try {
            String folderPath = request.getRequestURI().split("/delete-folder/" + userId + "/")[1];
            String prefix = userId + "/" + folderPath;
            storageService.deleteFolder(prefix);

            return ResponseEntity.ok("Deleted folder: " + prefix);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete folder");
        }
    }


    // ✅ Utility
    private String extractFilename(String path) {
        return path.substring(path.lastIndexOf("/") + 1);
    }
}
