package ra.edu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String dateOfBirth;
    private String gender;
}
