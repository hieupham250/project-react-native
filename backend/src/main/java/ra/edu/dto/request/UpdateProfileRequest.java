package ra.edu.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ra.edu.enums.Gender;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    private Integer userId;
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private Gender gender;
}
