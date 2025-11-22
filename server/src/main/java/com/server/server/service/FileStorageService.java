package com.server.server.service;

import com.server.server.config.FileStorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path avatarStorageLocation;
    private final Path postImageStorageLocation;

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.avatarStorageLocation = Paths.get(fileStorageProperties.getDir())
                .toAbsolutePath().normalize();
        this.postImageStorageLocation = Paths.get("uploads/posts")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.avatarStorageLocation);
            Files.createDirectories(this.postImageStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        return storeFile(file, avatarStorageLocation);
    }
    
    public String storePostImage(MultipartFile file) {
        return storeFile(file, postImageStorageLocation);
    }
    
    private String storeFile(MultipartFile file, Path storageLocation) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Generate unique filename
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = storageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String fileName) {
        deleteFile(fileName, avatarStorageLocation);
    }
    
    public void deletePostImage(String fileName) {
        deleteFile(fileName, postImageStorageLocation);
    }
    
    private void deleteFile(String fileName, Path storageLocation) {
        try {
            Path filePath = storageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName + ". Please try again!", ex);
        }
    }
}
