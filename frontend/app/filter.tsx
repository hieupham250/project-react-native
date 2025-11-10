import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Room } from "@/interface";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/apis/room.api";
import { RoomCard } from "@/components/room-card";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApply?: () => void;
  onClearAll?: () => void;
}

const FilterModal = ({
  visible,
  onClose,
  title,
  children,
  onApply,
  onClearAll,
}: FilterModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={"#6B7280"} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>{children}</ScrollView>
          {(onApply || onClearAll) && (
            <View style={styles.modalFooter}>
              {onClearAll && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={onClearAll}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
              {onApply && (
                <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default function FilterRoom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Filter states
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });

  const filteredAndSortedRooms = useCallback(() => {
    if (!rooms) return [];

    let filtered = [...rooms];

    filtered = filtered.filter((r) => r.price !== null);

    // Lọc theo khoảng giá
    if (selectedPriceRange) {
      filtered = filtered.filter(
        (r) =>
          (r.price ?? 0) >= selectedPriceRange.min &&
          (r.price ?? 0) <= selectedPriceRange.max
      );
    }

    // Sắp xếp
    switch (selectedSort) {
      case "price-low":
        filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [rooms, selectedSort, selectedPriceRange]);

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
        <Text style={styles.headerTitle}>Mumbai</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={24} color={"#1A1A1A"} />
        </TouchableOpacity>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Ionicons name="swap-vertical-outline" size={16} color="#6C7CE7" />
          <Text style={styles.filterButtonText}>Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setPriceModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Price</Text>
          <Ionicons name="chevron-down-outline" size={16} color="#6C7CE7" />
        </TouchableOpacity>
      </View>

      {/* Danh sách phòng */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C7CE7" />
            <Text style={styles.loadingText}>Loading rooms...</Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Failed to load rooms</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAndSortedRooms().length > 0 ? (
          filteredAndSortedRooms().map((room: Room) => (
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
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rooms found</Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <FilterModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        title="Sort"
      >
        {[
          {
            id: "price-low",
            label: "Price: Low to High",
            icon: "arrow-up-outline",
          },
          {
            id: "price-high",
            label: "Price: High to Low",
            icon: "arrow-down-outline",
          },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={styles.optionItem}
            onPress={() => {
              setSelectedSort(opt.id);
              setSortModalVisible(false);
            }}
          >
            <Ionicons
              name={opt.icon as any}
              size={20}
              color={selectedSort === opt.id ? "#6C7CE7" : "#6B7280"}
            />
            <Text
              style={[
                styles.optionText,
                selectedSort === opt.id && styles.optionTextSelected,
              ]}
            >
              {opt.label}
            </Text>
            {selectedSort === opt.id && (
              <Ionicons name="checkmark" size={20} color={"#6C7CE7"} />
            )}
          </TouchableOpacity>
        ))}
      </FilterModal>

      <FilterModal
        visible={priceModalVisible}
        onClose={() => setPriceModalVisible(false)}
        title="Select Price Range"
        onApply={() => {
          setPriceModalVisible(false);
        }}
        onClearAll={() => {
          setSelectedPriceRange(null);
        }}
      >
        {[
          { label: "Under 500,000 VND", min: 0, max: 500000 },
          { label: "500,000 - 1,000,000 VND", min: 500000, max: 1000000 },
          { label: "1,000,000 - 2,000,000 VND", min: 1000000, max: 2000000 },
          { label: "Over 2,000,000 VND", min: 2000000, max: 10000000 },
        ].map((range) => {
          const isSelected =
            selectedPriceRange?.min === range.min &&
            selectedPriceRange?.max === range.max;
          return (
            <TouchableOpacity
              key={range.label}
              style={styles.radioItem}
              onPress={() =>
                setSelectedPriceRange({ min: range.min, max: range.max })
              }
            >
              <View style={styles.radioButton}>
                {isSelected && <View style={styles.radioButtonInner} />}
              </View>
              <Text
                style={[
                  styles.radioText,
                  isSelected && styles.radioTextSelected,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </FilterModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#6B7280" },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  filterButtonText: { fontSize: 14, fontWeight: "500", color: "#6C7CE7" },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { fontSize: 16, color: "#6B7280" },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontSize: 16, color: "#6B7280" },
  retryText: { color: "#6C7CE7", fontWeight: "600", marginTop: 8 },
  roomCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  roomName: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  roomPrice: { color: "#6B7280", marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#6B7280" },
  modalBody: { padding: 16 },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6C7CE7",
    alignItems: "center",
  },
  clearButtonText: { fontSize: 16, fontWeight: "600", color: "#6C7CE7" },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#6C7CE7",
    alignItems: "center",
  },
  applyButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#6C7CE7",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6C7CE7",
  },
  radioText: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
  },
  radioTextSelected: {
    fontWeight: "600",
    color: "#6C7CE7",
  },
  hotelFilterInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
