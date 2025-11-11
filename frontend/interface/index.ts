export interface UserRegister {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
}

export interface Room {
  roomId: number;
  roomType: string;
  description: string;
  price: number | null;
  capacity: number;
  hotelId: number;
  hotelName: string;
  imageUrls: string[];
  address: string;
  rating: number | null;
  reviewCount: number | null;
}

export interface City {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Review {
  reviewId: number;
  roomId: number;
  roomType: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  roomId: number;
  userId: number;
  rating: number;
  comment: string;
}
