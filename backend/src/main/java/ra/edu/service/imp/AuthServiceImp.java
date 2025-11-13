package ra.edu.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ra.edu.dto.request.UpdateProfileRequest;
import ra.edu.dto.request.UserLogin;
import ra.edu.dto.request.UserRegister;
import ra.edu.dto.response.JWTResponse;
import ra.edu.dto.response.UserResponse;
import ra.edu.entity.User;
import ra.edu.enums.Gender;
import ra.edu.repository.UserRepository;
import ra.edu.security.jwt.JWTProvider;
import ra.edu.security.principal.CustomUserDetails;
import ra.edu.service.AuthService;

@Service
public class AuthServiceImp implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTProvider jwtProvider;

    @Override
    public JWTResponse login(UserLogin userLogin) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userLogin.getEmail(),
                            userLogin.getPassword()
                    )
            );
        } catch (DisabledException e) {
            throw new IllegalArgumentException("Tài khoản đã bị khóa");
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Sai tài khoản hoặc mật khẩu");
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Xác thực thất bại");
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtProvider.generateToken(customUserDetails.getUsername());

        return JWTResponse.builder()
                .id(customUserDetails.getId())
                .username(customUserDetails.getUsername())
                .email(customUserDetails.getEmail())
                .phone(customUserDetails.getPhone())
                .status(customUserDetails.getStatus())
                .authorities(customUserDetails.getAuthorities())
                .token(token)
                .build();
    }

    @Override
    public User register(UserRegister userRegister) {
        if (userRepository.findByEmail(userRegister.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        if (userRepository.findByPhone(userRegister.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        }

        User user = User.builder()
                .fullName(userRegister.getFullName())
                .email(userRegister.getEmail())
                .phone(userRegister.getPhone())
                .password(passwordEncoder.encode(userRegister.getPassword()))
                .dateOfBirth(userRegister.getDateOfBirth())
                .gender(userRegister.getGender())
                .status(true)
                .build();

        return userRepository.save(user);
    }

    @Override
    public UserResponse getUserDetail(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với ID: " + userId));

        return new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null,
                user.getGender() != null ? user.getGender().name() : null
        );
    }

    @Override
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với ID: " + request.getUserId()));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            userRepository.findByPhone(request.getPhone())
                    .filter(u -> !u.getUserId().equals(user.getUserId()))
                    .ifPresent(u -> { throw new IllegalArgumentException("Số điện thoại đã tồn tại"); });
            user.setPhone(request.getPhone());
        }

        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        userRepository.save(user);
        return new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null,
                user.getGender() != null ? user.getGender().name() : null
        );
    }
}