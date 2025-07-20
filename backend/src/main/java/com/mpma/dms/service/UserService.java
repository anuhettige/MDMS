package com.mpma.dms.service;

import com.mpma.dms.dto.UserDTO;

import java.io.IOException;
import java.util.List;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);
    UserDTO getUserById(Long id);
    List<UserDTO> getUsers();
    UserDTO userAuth(String username, String password);
    UserDTO updateUser(Long id, UserDTO userDTO);

}
