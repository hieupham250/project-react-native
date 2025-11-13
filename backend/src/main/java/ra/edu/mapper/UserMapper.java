package ra.edu.mapper;

import ra.edu.dto.response.UserResponse;
import ra.edu.entity.User;

public class UserMapper {
    public static UserResponse toResponse(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null,
                user.getGender() != null ? user.getGender().name() : null
        );
    }
}
