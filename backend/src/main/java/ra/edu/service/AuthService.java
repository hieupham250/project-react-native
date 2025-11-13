package ra.edu.service;

import ra.edu.dto.request.UpdateProfileRequest;
import ra.edu.dto.request.UserLogin;
import ra.edu.dto.request.UserRegister;
import ra.edu.dto.response.JWTResponse;
import ra.edu.dto.response.UserResponse;
import ra.edu.entity.User;

public interface AuthService {
    JWTResponse login(UserLogin userLogin);
    User register(UserRegister userRegister);
    UserResponse getUserDetail(Integer userId);
    UserResponse updateProfile(UpdateProfileRequest request);
}