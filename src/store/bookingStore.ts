import { create } from 'zustand';

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  farmerId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  totalPrice: number;
  withOperator: boolean;
  location: string;
  createdAt: Date;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Partial<Booking> | null;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'John Deere 5050D Tractor',
    farmerId: '1',
    ownerId: '2',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-15'),
    duration: '4 hours',
    status: 'confirmed',
    totalPrice: 2400,
    withOperator: true,
    location: 'Pune, Maharashtra',
    createdAt: new Date()
  },
  {
    id: '2',
    equipmentId: '3',
    equipmentName: 'DJI Agras T30 Drone',
    farmerId: '1',
    ownerId: '3',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-20'),
    duration: '2 hours',
    status: 'pending',
    totalPrice: 3000,
    withOperator: true,
    location: 'Nashik, Maharashtra',
    createdAt: new Date()
  }
];

export const useBookingStore = create<BookingState>((set) => ({
  bookings: mockBookings,
  currentBooking: null,

  addBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking]
    }));
  },

  updateBooking: (id, updates) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      )
    }));
  },

  cancelBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' } : b
      )
    }));
  },

  setCurrentBooking: (booking) => {
    set({ currentBooking: booking });
  }
}));