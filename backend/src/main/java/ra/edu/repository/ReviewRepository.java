package ra.edu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ra.edu.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByRoom_RoomId(Integer roomId);

    List<Review> findByUser_UserId(Integer userId);

    List<Review> findByRoom_RoomIdOrderByCreatedAtDesc(Integer roomId);

    boolean existsByUser_UserIdAndRoom_RoomId(Integer userId, Integer roomId);

    Review findByReviewId(Integer reviewId);

    Review findByUser_UserIdAndRoom_RoomId(Integer userId, Integer roomId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room.roomId = :roomId")
    Double findAverageRatingByRoomId(@Param("roomId") Integer roomId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.room.roomId = :roomId")
    Integer countByRoomId(@Param("roomId") Integer roomId);
}
