package ra.edu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Integer roomId;
    private String roomType;
    private Double price;
    private Integer capacity;
    private String description;
    private List<String> imageUrls;
    private Integer hotelId;
    private String hotelName;
    private String address;
    private Double rating;
    private Integer reviewCount;
}
