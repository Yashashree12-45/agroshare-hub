import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Negotiation {
  id: string;
  bookingId: string;
  equipmentId: string;
  equipmentName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  ownerId: string;
  originalPrice: number;
  proposedPrice: number;
  counterOfferPrice?: number;
  farmerMessage?: string;
  ownerMessage?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'farmer_accepted' | 'farmer_rejected';
  duration: string;
  date: string;
  withOperator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NegotiationState {
  negotiations: Negotiation[];
  addNegotiation: (negotiation: Negotiation) => void;
  updateNegotiation: (id: string, updates: Partial<Negotiation>) => void;
  acceptNegotiation: (id: string) => void;
  rejectNegotiation: (id: string, message?: string) => void;
  counterOffer: (id: string, counterPrice: number, message?: string) => void;
  farmerRespondToCounter: (id: string, accept: boolean) => void;
  getNegotiationsByOwner: (ownerId: string) => Negotiation[];
  getNegotiationsByFarmer: (farmerId: string) => Negotiation[];
  getPendingNegotiations: () => Negotiation[];
}

// Mock negotiations data
const mockNegotiations: Negotiation[] = [
  {
    id: 'NEG-001',
    bookingId: 'BK-001',
    equipmentId: '1',
    equipmentName: 'John Deere 5310',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '+91 98765 43210',
    ownerId: '2',
    originalPrice: 6400,
    proposedPrice: 5500,
    status: 'pending',
    duration: '8 hours',
    date: '2024-01-25',
    withOperator: true,
    farmerMessage: 'I am a regular customer. Please consider my offer.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'NEG-002',
    bookingId: 'BK-002',
    equipmentId: '2',
    equipmentName: 'Mahindra Harvester',
    farmerId: '3',
    farmerName: 'Amit Patil',
    farmerPhone: '+91 87654 32109',
    ownerId: '2',
    originalPrice: 12000,
    proposedPrice: 10000,
    counterOfferPrice: 11000,
    status: 'countered',
    duration: '1 day',
    date: '2024-01-28',
    withOperator: false,
    farmerMessage: 'Can you offer a discount for bulk booking?',
    ownerMessage: 'Best I can do is ₹11,000. This includes fuel.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useNegotiationStore = create<NegotiationState>()(
  persist(
    (set, get) => ({
      negotiations: mockNegotiations,

      addNegotiation: (negotiation) => {
        set((state) => ({
          negotiations: [...state.negotiations, negotiation],
        }));
      },

      updateNegotiation: (id, updates) => {
        set((state) => ({
          negotiations: state.negotiations.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
          ),
        }));
      },

      acceptNegotiation: (id) => {
        set((state) => ({
          negotiations: state.negotiations.map((n) =>
            n.id === id ? { ...n, status: 'accepted', updatedAt: new Date() } : n
          ),
        }));
      },

      rejectNegotiation: (id, message) => {
        set((state) => ({
          negotiations: state.negotiations.map((n) =>
            n.id === id ? { ...n, status: 'rejected', ownerMessage: message, updatedAt: new Date() } : n
          ),
        }));
      },

      counterOffer: (id, counterPrice, message) => {
        set((state) => ({
          negotiations: state.negotiations.map((n) =>
            n.id === id
              ? { ...n, status: 'countered', counterOfferPrice: counterPrice, ownerMessage: message, updatedAt: new Date() }
              : n
          ),
        }));
      },

      farmerRespondToCounter: (id, accept) => {
        set((state) => ({
          negotiations: state.negotiations.map((n) =>
            n.id === id
              ? { ...n, status: accept ? 'farmer_accepted' : 'farmer_rejected', updatedAt: new Date() }
              : n
          ),
        }));
      },

      getNegotiationsByOwner: (ownerId) => {
        return get().negotiations.filter((n) => n.ownerId === ownerId);
      },

      getNegotiationsByFarmer: (farmerId) => {
        return get().negotiations.filter((n) => n.farmerId === farmerId);
      },

      getPendingNegotiations: () => {
        return get().negotiations.filter((n) => n.status === 'pending');
      },
    }),
    {
      name: 'negotiation-storage',
    }
  )
);
