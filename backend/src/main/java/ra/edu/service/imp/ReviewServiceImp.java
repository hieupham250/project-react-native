package ra.edu.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ra.edu.dto.request.ReviewRequest;
import ra.edu.dto.response.ReviewResponse;
import ra.edu.entity.Review;
import ra.edu.entity.Room;
import ra.edu.entity.User;
import ra.edu.mapper.ReviewMapper;
import ra.edu.repository.ReviewRepository;
import ra.edu.repository.RoomRepository;
import ra.edu.repository.UserRepository;
import ra.edu.service.ReviewService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImp implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (reviewRepository.existsByUser_UserIdAndRoom_RoomId(user.getUserId(), room.getRoomId())) {
            throw new RuntimeException("đã đánh giá");
        }

        Review review = Review.builder()
                .user(user)
                .room(room)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        review = reviewRepository.save(review);
        return ReviewMapper.toResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByRoomId(Integer roomId) {
        List<Review> reviews = reviewRepository.findByRoom_RoomIdOrderByCreatedAtDesc(roomId);
        return reviews.stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }
}
