import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { searchRooms } from "@/apis/room.api";
import { RoomCard } from "@/components/room-card";

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState<string>("");
  const searchTimeout = useRef<number | null>(null);

  const {
    data: rooms,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["search-rooms", searchText],
    queryFn: () => searchRooms(searchText),
    enabled: false,
  });

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (searchText.trim() !== "") {
        refetch();
      }
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchText]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={"#FFFFFF"} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={"#1A1A1A"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={24} color={"#1A1A1A"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={"#6B7280"}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        </View>

        <TouchableOpacity style={styles.locationOption}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="locate-outline" size={24} color={"#6C7CE7"} />
          </View>
          <Text style={styles.locationText}>or use my current location</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Search</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchText ? "Kết quả tìm kiếm" : "Phòng gần bạn"}
          </Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : rooms && rooms.length > 0 ? (
            <View style={styles.hotelsList}>
              {rooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  onPress={() =>
                    router.push({
                      pathname: "/room-detail/[id]",
                      params: { id: String(room.roomId) },
                    })
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchText ? "Không tìm thấy phòng nào" : "Không có phòng nào"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "'#1A1A1A'",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "'#F9FAFB'",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "'#1A1A1A'",
    borderWidth: 1,
    borderColor: "'#E5E7EB'",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "6C7CE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    color: "'#1A1A1A'",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "'#1A1A1A'",
    marginBottom: 16,
  },
  hotelsList: {
    gap: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
