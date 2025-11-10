package ra.edu.service;

import ra.edu.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {
    List<RoomResponse> getRooms();
    List<RoomResponse> getRoomsByHotelId(Integer hotelId);
    RoomResponse getRoomById(Integer roomId);
    List<RoomResponse> searchRooms(String keyword);
}
