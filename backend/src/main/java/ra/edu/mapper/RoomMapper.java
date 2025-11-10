package ra.edu.mapper;

import ra.edu.dto.response.RoomResponse;
import ra.edu.entity.Room;

import java.util.List;

public class RoomMapper {
    public static RoomResponse toResponse(Room room, Double avgRating, Integer reviewCount) {
        if (room == null) return null;

        List<String> imageUrls = room.getImages() != null
                ? room.getImages().stream()
                .map(image -> image.getImageUrl())
                .toList()
                : List.of();

        return new RoomResponse(
                room.getRoomId(),
                room.getRoomType(),
                room.getPrice(),
                room.getCapacity(),
                room.getDescription(),
                imageUrls,
                room.getHotel().getHotelId(),
                room.getHotel().getHotelName(),
                room.getHotel().getAddress(),
                avgRating,
                reviewCount
        );
    }
}
