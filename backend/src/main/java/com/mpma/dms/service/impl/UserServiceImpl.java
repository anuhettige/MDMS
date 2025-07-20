package com.mpma.dms.service.impl;

import com.mpma.dms.dto.StudentDTO;
import com.mpma.dms.dto.UserDTO;
import com.mpma.dms.entity.Student;
import com.mpma.dms.entity.User;
import com.mpma.dms.enums.UserType;
import com.mpma.dms.exception.AuthException;
import com.mpma.dms.repository.StudentRepository;
import com.mpma.dms.repository.UserRepository;
import com.mpma.dms.security.JwtUtil;
import com.mpma.dms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AzureStorageService storageService;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = User.builder()
                .id(userDTO.getId())
                .userType(userDTO.getUserType())
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .accessToken(userDTO.getAccessToken())
                .build();

        User savedUser = userRepository.save(user);

        if (userDTO.getStudent() != null && userDTO.getUserType() == UserType.STUDENT) {
            StudentDTO studentDTO = userDTO.getStudent();

            Student student = Student.builder()
                    .fullName(studentDTO.getFullName())
                    .nameWithInitials(studentDTO.getNameWithInitials())
                    .nic(studentDTO.getNic())
                    .gpa(studentDTO.getGpa())
                    .isEligible(studentDTO.isEligible())
                    .user(savedUser)
                    .build();

            studentRepository.save(student);
        }

        createDefaultTextFiles(savedUser.getId().toString());

        return mapToDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(Long id) {
        String loggedInUsername = getLoggedInUsername();

        User loggedInUser = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        if (!loggedInUser.getId().equals(id)) {
            throw new AccessDeniedException("You are not authorized to access this user data");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        return mapToDTO(user);
    }

    @Override
    public UserDTO userAuth(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found with username: " + username));

        if (!user.getPassword().equals(password)) {
            throw new AuthException("Invalid password");
        }

        String token = JwtUtil.generateToken(username);
        user.setAccessToken(token); // optional: save if needed
        userRepository.save(user);  // only if you store tokens

        return mapToDTO(user);
    }

    @Override
    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToDTO).toList();
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        String loggedInUsername = getLoggedInUsername();

        User loggedInUser = userRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        if (!loggedInUser.getId().equals(id)) {
            throw new AccessDeniedException("You are not authorized to update this user");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getPassword() != null) {
            user.setPassword(userDTO.getPassword());
        }

        if (user.getUserType() == UserType.STUDENT && userDTO.getStudent() != null) {
            Student student = user.getStudent();
            StudentDTO studentDTO = userDTO.getStudent();

            if (student != null) {
                if (studentDTO.getFullName() != null) {
                    student.setFullName(studentDTO.getFullName());
                }

                if (studentDTO.getNameWithInitials() != null) {
                    student.setNameWithInitials(studentDTO.getNameWithInitials());
                }

                if (studentDTO.getNic() != null) {
                    student.setNic(studentDTO.getNic());
                }

                if (studentDTO.getGpa() != null) {
                    student.setGpa(studentDTO.getGpa());
                }

                student.setEligible(studentDTO.isEligible());
            }
        }

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    // ==============================
    // Helpers
    // ==============================

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);

        if (user.getStudent() != null) {
            StudentDTO studentDTO = new StudentDTO();
            BeanUtils.copyProperties(user.getStudent(), studentDTO);
            dto.setStudent(studentDTO);
        }

        return dto;
    }

    private void createDefaultTextFiles(String userId) {
        String videos = userId + "/Photos/Videos.txt";
        String music = userId + "/Music/Music.txt";
        String pictures = userId + "/Pictures/Pictures.txt";
        String documents = userId + "/Documents/Documents.txt";

        String content = "This is default file for user " + userId;
        storageService.uploadFileFromText(videos, content);
        storageService.uploadFileFromText(music, content);
        storageService.uploadFileFromText(pictures, content);
        storageService.uploadFileFromText(documents, content);
    }

    private String getLoggedInUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}
