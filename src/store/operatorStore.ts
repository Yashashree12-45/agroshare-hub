import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  experience: number; // years
  rating: number;
  completedJobs: number;
  specializations: string[];
  location: string;
  hourlyRate: number;
  available: boolean;
  verified: boolean;
}

interface OperatorState {
  operators: Operator[];
  addOperator: (operator: Operator) => void;
  updateOperator: (id: string, updates: Partial<Operator>) => void;
  getAvailableOperators: () => Operator[];
}

const mockOperators: Operator[] = [
  {
    id: 'op1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    experience: 8,
    rating: 4.8,
    completedJobs: 156,
    specializations: ['Tractor', 'Harvester', 'Tiller'],
    location: 'Pune, Maharashtra',
    hourlyRate: 500,
    available: true,
    verified: true
  },
  {
    id: 'op2',
    name: 'Suresh Patil',
    email: 'suresh@example.com',
    phone: '+91 87654 32109',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    experience: 5,
    rating: 4.5,
    completedJobs: 89,
    specializations: ['Drone', 'Sprayer'],
    location: 'Nashik, Maharashtra',
    hourlyRate: 600,
    available: true,
    verified: true
  },
  {
    id: 'op3',
    name: 'Mahesh Jadhav',
    email: 'mahesh@example.com',
    phone: '+91 76543 21098',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mahesh',
    experience: 12,
    rating: 4.9,
    completedJobs: 245,
    specializations: ['Tractor', 'Harvester', 'Water Pump'],
    location: 'Kolhapur, Maharashtra',
    hourlyRate: 550,
    available: true,
    verified: true
  }
];

export const useOperatorStore = create<OperatorState>()(
  persist(
    (set, get) => ({
      operators: mockOperators,

      addOperator: (operator) => {
        set((state) => ({
          operators: [...state.operators, operator]
        }));
      },

      updateOperator: (id, updates) => {
        set((state) => ({
          operators: state.operators.map((op) =>
            op.id === id ? { ...op, ...updates } : op
          )
        }));
      },

      getAvailableOperators: () => {
        return get().operators.filter((op) => op.available);
      }
    }),
    {
      name: 'operator-storage'
    }
  )
);
