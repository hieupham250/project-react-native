package ra.edu.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ra.edu.dto.response.RoomResponse;
import ra.edu.entity.Room;
import ra.edu.mapper.RoomMapper;
import ra.edu.repository.ReviewRepository;
import ra.edu.repository.RoomRepository;
import ra.edu.service.RoomService;

import java.util.List;

@Service
public class RoomServiceImp implements RoomService {
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<RoomResponse> getRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(room -> {
                    Double avgRating = reviewRepository.findAverageRatingByRoomId(room.getRoomId());
                    Integer reviewCount = reviewRepository.countByRoomId(room.getRoomId());
                    return RoomMapper.toResponse(room, avgRating, reviewCount);
                })
                .toList();
    }

    @Override
    public List<RoomResponse> getRoomsByHotelId(Integer hotelId) {
        List<Room> rooms = roomRepository.findByHotel_HotelId(hotelId);
        return rooms.stream()
                .map(room -> {
                    Double avgRating = reviewRepository.findAverageRatingByRoomId(room.getRoomId());
                    Integer reviewCount = reviewRepository.countByRoomId(room.getRoomId());
                    return RoomMapper.toResponse(room, avgRating, reviewCount);
                })
                .toList();
    }

    @Override
    public RoomResponse getRoomById(Integer roomId) {
        return roomRepository.findByRoomId(roomId)
                .map(room -> {
                    Double avgRating = reviewRepository.findAverageRatingByRoomId(room.getRoomId());
                    Integer reviewCount = reviewRepository.countByRoomId(room.getRoomId());
                    return RoomMapper.toResponse(room, avgRating, reviewCount);
                })
                .orElse(null);
    }

    @Override
    public List<RoomResponse> searchRooms(String keyword) {
        List<Room> rooms = roomRepository.findByRoomTypeContainingIgnoreCase(keyword);
        return rooms.stream()
                .map(room -> {
                    Double avgRating = reviewRepository.findAverageRatingByRoomId(room.getRoomId());
                    Integer reviewCount = reviewRepository.countByRoomId(room.getRoomId());
                    return RoomMapper.toResponse(room, avgRating, reviewCount);
                })
                .toList();
    }
}
