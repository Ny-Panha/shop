package com.casehaven.shop.auth;

import com.casehaven.shop.exception.AppException;
import com.casehaven.shop.exception.ResourceNotFoundException;
import com.casehaven.shop.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException("An account with email " + req.getEmail() + " already exists", "EMAIL_EXISTS");
        }

        User user = new User(
                req.getFullName(),
                req.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(req.getPassword()),
                req.getPhone(),
                req.getAddress(),
                req.getCity(),
                Role.ROLE_CUSTOMER
        );

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.createToken(saved.getEmail(), saved.getRole().name());
        return new AuthResponse(token, new UserDto(saved));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new AppException("Invalid email or password", "BAD_CREDENTIALS"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password", "BAD_CREDENTIALS");
        }

        if (!user.getActive()) {
            throw new AppException("Account is suspended or deactivated", "ACCOUNT_DISABLED");
        }

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, new UserDto(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return new UserDto(user);
    }
}
