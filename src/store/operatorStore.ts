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
  bio?: string;
  languages?: string[];
  certifications?: string[];
}

interface OperatorState {
  operators: Operator[];
  addOperator: (operator: Operator) => void;
  updateOperator: (id: string, updates: Partial<Operator>) => void;
  removeOperator: (id: string) => void;
  getAvailableOperators: () => Operator[];
  getOperatorsBySpecialization: (equipmentType: string) => Operator[];
  setOperatorAvailability: (id: string, available: boolean) => void;
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
    verified: true,
    bio: 'Experienced tractor operator with 8+ years in agriculture.',
    languages: ['Hindi', 'Marathi', 'English'],
    certifications: ['Heavy Vehicle License', 'Agricultural Equipment Certification']
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
    verified: true,
    bio: 'Certified drone pilot specializing in crop spraying and monitoring.',
    languages: ['Hindi', 'Marathi'],
    certifications: ['Drone Pilot License', 'Pesticide Application Certificate']
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
    specializations: ['Tractor', 'Harvester', 'Water Pump', 'Combine'],
    location: 'Kolhapur, Maharashtra',
    hourlyRate: 550,
    available: true,
    verified: true,
    bio: 'Senior agricultural equipment operator with expertise in harvesting.',
    languages: ['Hindi', 'Marathi', 'Kannada'],
    certifications: ['Master Operator Certificate', 'Safety Training']
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

      removeOperator: (id) => {
        set((state) => ({
          operators: state.operators.filter((op) => op.id !== id)
        }));
      },

      getAvailableOperators: () => {
        return get().operators.filter((op) => op.available);
      },

      getOperatorsBySpecialization: (equipmentType: string) => {
        return get().operators.filter(
          op => op.available && op.specializations.some(s => 
            equipmentType.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(equipmentType.toLowerCase().split(' ')[0])
          )
        );
      },

      setOperatorAvailability: (id, available) => {
        set((state) => ({
          operators: state.operators.map((op) =>
            op.id === id ? { ...op, available } : op
          )
        }));
      }
    }),
    {
      name: 'operator-storage'
    }
  )
);
