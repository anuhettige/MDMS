//package com.mpma.dms.controller;
//
//
// import com.mpma.dms.entity.User;
// import com.mpma.dms.repository.UserRepository;
//// import com.mpma.dms.security.JwtUtil;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthenticationManager authenticationManager;
//    private final JwtUtil jwtUtil;
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
//        try {
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(username, password)
//            );
//            String token = jwtUtil.generateToken(username);
//            return ResponseEntity.ok(token);
//        } catch (AuthenticationException e) {
//            return ResponseEntity.badRequest().body("Invalid credentials");
//        }
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestParam String username,
//                                           @RequestParam String password,
//                                           @RequestParam String role) {
//        if (userRepository.findByUsername(username).isPresent()) {
//            return ResponseEntity.badRequest().body("Username already taken");
//        }
//
//        User user = User.builder()
//                .username(username)
//                .password(passwordEncoder.encode(password))
//                .role(role)
//                .build();
//        userRepository.save(user);
//
//        return ResponseEntity.ok("User registered successfully");
//    }
//}
//
