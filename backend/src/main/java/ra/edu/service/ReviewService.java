package ra.edu.service;

import ra.edu.dto.request.ReviewRequest;
import ra.edu.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request);
    List<ReviewResponse> getReviewsByRoomId(Integer roomId);
}
