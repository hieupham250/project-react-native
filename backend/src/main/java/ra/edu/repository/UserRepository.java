package ra.edu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
}
