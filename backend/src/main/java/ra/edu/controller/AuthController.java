package ra.edu.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ra.edu.dto.request.*;
import ra.edu.dto.response.BaseResponse;
import ra.edu.dto.response.JWTResponse;
import ra.edu.entity.User;
import ra.edu.service.AuthService;

import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<JWTResponse>> login(@RequestBody UserLogin userLogin){
        return new ResponseEntity<>(
                new BaseResponse<>(
                        true,
                        "Đăng nhập thành công",
                        authService.login(userLogin),
                        null,
                        LocalDateTime.now()
                ),
                HttpStatus.OK
        );
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<User>> register(@RequestBody @Valid UserRegister userRegister){
        System.out.println(userRegister);
        authService.register(userRegister);
        return new ResponseEntity<>(
                new BaseResponse<>(
                        true,
                        "Đăng ký thành công",
                        null,
                        null,
                        LocalDateTime.now()
                ),
                HttpStatus.CREATED
        );
    }
}
