package ra.edu.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;
    @Column(length = 100,nullable = false, unique = true)
    private String username;
    @Column(unique = true, length = 100)
    private String email;
    @Column(unique = true, length = 20)
    private String phone;
    @Column(nullable = false)
    private String password;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    private Boolean verified;
    private Boolean status;
    private Boolean isDeleted;
}
