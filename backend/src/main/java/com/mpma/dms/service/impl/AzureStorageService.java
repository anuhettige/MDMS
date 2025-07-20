package com.mpma.dms.service.impl;

import com.azure.core.http.rest.PagedIterable;
import com.azure.core.util.BinaryData;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.blob.specialized.BlockBlobClient;
import com.mpma.dms.dto.FileInfoDTO;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AzureStorageService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private BlobContainerClient containerClient;

    @PostConstruct
    public void init() {
        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
        containerClient = serviceClient.getBlobContainerClient(containerName);

        if (!containerClient.exists()) {
            containerClient.create();
        }
    }

    // ✅ Upload with folder support
    public void uploadFile(MultipartFile file, String pathWithFilename) throws IOException {
        BlobClient blobClient = containerClient.getBlobClient(pathWithFilename);
        blobClient.upload(file.getInputStream(), file.getSize(), true);
    }

    // ✅ Download
    public byte[] downloadFile(String pathWithFilename) throws IOException {
        BlobClient blobClient = containerClient.getBlobClient(pathWithFilename);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.download(outputStream);
        return outputStream.toByteArray();
    }

    // ✅ Delete
    public void deleteFile(String pathWithFilename) {
        BlobClient blobClient = containerClient.getBlobClient(pathWithFilename);
        if (blobClient.exists()) {
            blobClient.delete();
        }
    }

    // ✅ List all files under a prefix (user folder or subfolder)
    public List<FileInfoDTO> listUserFilesWithMetadata(String prefix) {
        List<FileInfoDTO> result = new ArrayList<>();

        // ✅ List blobs and folders using delimiter "/"
        PagedIterable<BlobItem> blobs = containerClient.listBlobsByHierarchy(
                "/", new ListBlobsOptions().setPrefix(prefix), null
        );

        for (BlobItem blobItem : blobs) {
            String fullName = blobItem.getName();

            // ✅ Skip empty names (happens with root folder sometimes)
            if (fullName.equals(prefix)) continue;

            boolean isFolder = fullName.endsWith("/");
            String relativeName = fullName.substring(prefix.length());

            // ✅ Ignore nested folders if you only want immediate children
            if (relativeName.contains("/") && !isFolder) continue;

            FileInfoDTO dto = new FileInfoDTO();
            dto.setName(relativeName);
            dto.setType(isFolder ? "folder" : getExtension(fullName));
            dto.setSize(isFolder ? 0 : blobItem.getProperties().getContentLength());
            dto.setLastModified(isFolder ? null : blobItem.getProperties().getLastModified());
            dto.setFolder(isFolder);

            result.add(dto);
        }

        return result;
    }



    private String getExtension(String name) {
        int lastDot = name.lastIndexOf('.');
        return (lastDot != -1 && lastDot < name.length() - 1)
                ? name.substring(lastDot + 1)
                : "unknown";
    }

    public void uploadFileFromText(String path, String content) {
        BlockBlobClient blobClient = containerClient.getBlobClient(path).getBlockBlobClient();
        blobClient.upload(BinaryData.fromString(content), true);
    }

    public void deleteFolder(String folderPrefix) {
        // Ensure folder prefix ends with "/"
        if (!folderPrefix.endsWith("/")) {
            folderPrefix += "/";
        }

        // Get all blobs under the folderPrefix recursively
        PagedIterable<BlobItem> blobs = containerClient.listBlobs(new ListBlobsOptions().setPrefix(folderPrefix), null);

        for (BlobItem blobItem : blobs) {
            BlobClient blobClient = containerClient.getBlobClient(blobItem.getName());
            if (blobClient.exists()) {
                blobClient.delete();
            }
        }
    }



}
