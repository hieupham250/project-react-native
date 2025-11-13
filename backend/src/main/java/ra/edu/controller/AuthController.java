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
import ra.edu.dto.response.UserResponse;
import ra.edu.entity.User;
import ra.edu.service.AuthService;

import java.time.LocalDateTime;

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

    @GetMapping("/me/{id}")
    public ResponseEntity<BaseResponse<UserResponse>> getUserDetail(@PathVariable("id") Integer userId) {
        UserResponse userResponse = authService.getUserDetail(userId);
        return new ResponseEntity<>(
                new BaseResponse<>(
                        true,
                        "Lấy thông tin user thành công",
                        userResponse,
                        null,
                        LocalDateTime.now()
                ),
                HttpStatus.OK
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<BaseResponse<UserResponse>> updateProfile(
            @RequestBody @Valid UpdateProfileRequest updateProfileRequest) {
        UserResponse updatedUser = authService.updateProfile(updateProfileRequest);
        return new ResponseEntity<>(
                new BaseResponse<>(
                        true,
                        "Cập nhật thông tin user thành công",
                        updatedUser,
                        null,
                        LocalDateTime.now()
                ),
                HttpStatus.OK
        );
    }
}
