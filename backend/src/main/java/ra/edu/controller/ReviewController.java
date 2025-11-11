package ra.edu.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ra.edu.dto.request.ReviewRequest;
import ra.edu.dto.response.BaseResponse;
import ra.edu.dto.response.ReviewResponse;
import ra.edu.service.ReviewService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<BaseResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse review = reviewService.createReview(request);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Đánh giá thành công",
                review,
                null,
                LocalDateTime.now()
        ));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<BaseResponse<List<ReviewResponse>>> getReviewsByRoomId(@PathVariable Integer roomId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByRoomId(roomId);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Lấy danh sách đánh giá thành công",
                reviews,
                null,
                LocalDateTime.now()
        ));
    }
}
