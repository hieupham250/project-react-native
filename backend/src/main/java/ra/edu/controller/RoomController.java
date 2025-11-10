package ra.edu.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ra.edu.dto.response.BaseResponse;
import ra.edu.dto.response.RoomResponse;
import ra.edu.service.RoomService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<BaseResponse<List<RoomResponse>>> getRooms() {
        List<RoomResponse> rooms = roomService.getRooms();
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Lấy danh sách phòng thành công",
                rooms,
                null,
                LocalDateTime.now()
        ));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<BaseResponse<List<RoomResponse>>> getRoomsByHotelId(@PathVariable Integer hotelId) {
        List<RoomResponse> rooms = roomService.getRoomsByHotelId(hotelId);
         return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Lấy danh sách phòng theo khách sạn thành công",
                rooms,
                null,
                LocalDateTime.now()
        ));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<BaseResponse<RoomResponse>> getRoomById(@PathVariable Integer roomId) {
        RoomResponse room = roomService.getRoomById(roomId);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Lấy thông tin phòng thành công",
                room,
                null,
                LocalDateTime.now()
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<BaseResponse<List<RoomResponse>>> searchRooms(@RequestParam String keyword) {
        List<RoomResponse> rooms = roomService.searchRooms(keyword);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Tìm kiếm phòng thành công",
                rooms,
                null,
                LocalDateTime.now()
        ));
    }
}
