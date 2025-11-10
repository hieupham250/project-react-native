import { getRooms } from "@/apis/room.api";
import { City, Room } from "@/interface";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "@/components/search-bar";
import { CityButton } from "@/components/city-button";
import { RoomCard } from "@/components/room-card";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cities = [
    {
      id: 1,
      name: "Mumbai",
      image:
        "https://res.cloudinary.com/dh775j9ez/image/upload/v1762499602/M%E1%BB%99t_g%C3%B3c_TP._Pleiku_msoamw.jpg",
    },
    {
      id: 2,
      name: "Goa",
      image:
        "https://res.cloudinary.com/dh775j9ez/image/upload/v1762499602/M%E1%BB%99t_g%C3%B3c_TP._Pleiku_msoamw.jpg",
    },
    {
      id: 3,
      name: "Chennai",
      image:
        "https://res.cloudinary.com/dh775j9ez/image/upload/v1762499602/M%E1%BB%99t_g%C3%B3c_TP._Pleiku_msoamw.jpg",
    },
    {
      id: 4,
      name: "Jaipur",
      image:
        "https://res.cloudinary.com/dh775j9ez/image/upload/v1762499602/M%E1%BB%99t_g%C3%B3c_TP._Pleiku_msoamw.jpg",
    },
    {
      id: 5,
      name: "Puri",
      image:
        "https://res.cloudinary.com/dh775j9ez/image/upload/v1762499602/M%E1%BB%99t_g%C3%B3c_TP._Pleiku_msoamw.jpg",
    },
  ];

  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });

  const renderSectionHeader = (title: string, onSeeAll?: () => void) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading rooms</Text>;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="grid-outline" size={22} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>live Green</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="person-outline" size={22} color={"#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <SearchBar onPress={() => router.push("/search")} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityScroll}
          contentContainerStyle={styles.cityScrollContent}
        >
          {cities.map((city) => (
            <TouchableOpacity key={city.id} style={styles.cityCard}>
              <Image source={{ uri: city.image }} style={styles.cityImage} />
              <Text style={styles.cityName}>{city.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* best rooms */}
        {renderSectionHeader("Best Rooms", () => router.push("/filter"))}
        <FlatList
          data={rooms || []}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              variant="horizontal"
              onPress={() =>
                router.push({
                  pathname: "/room-detail/[id]",
                  params: { id: String(item.roomId) },
                })
              }
            />
          )}
          keyExtractor={(item) => String(item.roomId)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roomList}
        />
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#6C7CE7",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cityScroll: {
    marginTop: 20,
    marginBottom: 8,
  },
  cityScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  citiesSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  cityCard: {
    alignItems: "center",
    marginRight: 16,
  },
  cityImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6C7CE7",
  },
  roomList: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});
