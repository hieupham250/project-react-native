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
