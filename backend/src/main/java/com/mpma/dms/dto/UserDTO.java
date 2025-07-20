package com.mpma.dms.dto;

import com.mpma.dms.enums.UserType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private StudentDTO student;
    private Long id;
    private String username;
    private String password;
    private String accessToken;
    private UserType userType;
}
