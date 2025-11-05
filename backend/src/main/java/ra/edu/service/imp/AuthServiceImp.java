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
import ra.edu.dto.request.UserLogin;
import ra.edu.dto.request.UserRegister;
import ra.edu.dto.response.JWTResponse;
import ra.edu.entity.User;
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
}