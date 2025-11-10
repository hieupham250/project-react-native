package ra.edu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ra.edu.entity.Room;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN FETCH r.images " +
            "LEFT JOIN FETCH r.hotel")
    List<Room> findAll();

    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN FETCH r.images " +
            "LEFT JOIN FETCH r.hotel " +
            "WHERE r.hotel.hotelId = :hotelId")
    List<Room> findByHotel_HotelId(@Param("hotelId") Integer hotelId);

    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN FETCH r.images " +
            "LEFT JOIN FETCH r.hotel " +
            "WHERE LOWER(r.roomType) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Room> findByRoomTypeContainingIgnoreCase(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN FETCH r.images " +
            "LEFT JOIN FETCH r.hotel " +
            "WHERE r.roomId = :roomId")
    Optional<Room> findByRoomId(@Param("roomId") Integer roomId);
}
