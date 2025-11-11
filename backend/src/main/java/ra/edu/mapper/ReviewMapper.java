package ra.edu.mapper;

import ra.edu.dto.response.ReviewResponse;
import ra.edu.entity.Review;

public class ReviewMapper {
    public static ReviewResponse toResponse(Review review) {
        if (review == null) return null;

        return new ReviewResponse(
                review.getReviewId(),
                review.getRoom().getRoomId(),
                review.getRoom().getRoomType(),
                review.getUser().getUserId(),
                review.getUser().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
