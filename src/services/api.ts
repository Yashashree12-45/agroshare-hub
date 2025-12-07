import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock data for equipment
export interface Equipment {
  id: string;
  name: string;
  type: 'tractor' | 'harvester' | 'drone' | 'tiller' | 'sprayer' | 'pump';
  brand: string;
  model: string;
  year: number;
  power: string;
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerAcre?: number;
  location: {
    village: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  status: 'available' | 'booked' | 'in-use' | 'maintenance';
  owner: {
    id: string;
    name: string;
    rating: number;
    totalRentals: number;
    avatar: string;
  };
  rating: number;
  totalReviews: number;
  features: string[];
  operatorAvailable: boolean;
  fuelIncluded: boolean;
  transportCharge: number;
  lastService: string;
  distance?: number;
}

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'John Deere 5050D',
    type: 'tractor',
    brand: 'John Deere',
    model: '5050D',
    year: 2022,
    power: '50 HP',
    images: [
      'https://images.unsplash.com/photo-1605002989198-39d64e57520c?w=800',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800'
    ],
    pricePerHour: 600,
    pricePerDay: 4500,
    pricePerAcre: 800,
    location: {
      village: 'Shirur',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 18.8252,
      lng: 74.3762
    },
    status: 'available',
    owner: {
      id: '2',
      name: 'Rajesh Patil',
      rating: 4.8,
      totalRentals: 156,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh'
    },
    rating: 4.9,
    totalReviews: 89,
    features: ['Power Steering', 'AC Cabin', 'GPS System'],
    operatorAvailable: true,
    fuelIncluded: false,
    transportCharge: 500,
    lastService: '2024-01-15',
    distance: 5.2
  },
  {
    id: '2',
    name: 'Mahindra 575 DI',
    type: 'tractor',
    brand: 'Mahindra',
    model: '575 DI',
    year: 2021,
    power: '47 HP',
    images: [
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?w=800'
    ],
    pricePerHour: 500,
    pricePerDay: 3800,
    pricePerAcre: 700,
    location: {
      village: 'Junnar',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 19.2094,
      lng: 73.8756
    },
    status: 'available',
    owner: {
      id: '3',
      name: 'Suresh More',
      rating: 4.6,
      totalRentals: 98,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh'
    },
    rating: 4.7,
    totalReviews: 67,
    features: ['Power Steering', 'Dual Clutch'],
    operatorAvailable: true,
    fuelIncluded: true,
    transportCharge: 400,
    lastService: '2024-01-20',
    distance: 12.8
  },
  {
    id: '3',
    name: 'DJI Agras T30',
    type: 'drone',
    brand: 'DJI',
    model: 'Agras T30',
    year: 2023,
    power: '30L Tank',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800'
    ],
    pricePerHour: 1500,
    pricePerDay: 10000,
    pricePerAcre: 400,
    location: {
      village: 'Talegaon',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 18.7343,
      lng: 73.6756
    },
    status: 'available',
    owner: {
      id: '4',
      name: 'Amit Sharma',
      rating: 4.9,
      totalRentals: 234,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit'
    },
    rating: 4.9,
    totalReviews: 156,
    features: ['30L Spray Tank', 'AI Precision', 'Obstacle Avoidance'],
    operatorAvailable: true,
    fuelIncluded: true,
    transportCharge: 0,
    lastService: '2024-02-01',
    distance: 8.3
  },
  {
    id: '4',
    name: 'Kubota DC-70',
    type: 'harvester',
    brand: 'Kubota',
    model: 'DC-70',
    year: 2020,
    power: '70 HP',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
    ],
    pricePerHour: 2000,
    pricePerDay: 15000,
    pricePerAcre: 1200,
    location: {
      village: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 18.1518,
      lng: 74.5815
    },
    status: 'booked',
    owner: {
      id: '5',
      name: 'Vijay Jadhav',
      rating: 4.7,
      totalRentals: 78,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vijay'
    },
    rating: 4.8,
    totalReviews: 45,
    features: ['Auto Threshing', 'Grain Tank 1400L', 'Straw Chopper'],
    operatorAvailable: true,
    fuelIncluded: false,
    transportCharge: 1500,
    lastService: '2024-01-10',
    distance: 25.6
  },
  {
    id: '5',
    name: 'Honda WB30X',
    type: 'pump',
    brand: 'Honda',
    model: 'WB30X',
    year: 2023,
    power: '5.5 HP',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
    ],
    pricePerHour: 150,
    pricePerDay: 800,
    location: {
      village: 'Shirur',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 18.8300,
      lng: 74.3800
    },
    status: 'available',
    owner: {
      id: '2',
      name: 'Rajesh Patil',
      rating: 4.8,
      totalRentals: 156,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh'
    },
    rating: 4.6,
    totalReviews: 34,
    features: ['Self Priming', 'Low Fuel Consumption'],
    operatorAvailable: false,
    fuelIncluded: false,
    transportCharge: 100,
    lastService: '2024-01-25',
    distance: 5.5
  },
  {
    id: '6',
    name: 'Stihl SR 450',
    type: 'sprayer',
    brand: 'Stihl',
    model: 'SR 450',
    year: 2022,
    power: '3.9 HP',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ],
    pricePerHour: 200,
    pricePerDay: 1200,
    pricePerAcre: 150,
    location: {
      village: 'Khed',
      district: 'Pune',
      state: 'Maharashtra',
      lat: 18.8600,
      lng: 73.8900
    },
    status: 'available',
    owner: {
      id: '6',
      name: 'Prakash Gaikwad',
      rating: 4.5,
      totalRentals: 67,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prakash'
    },
    rating: 4.5,
    totalReviews: 28,
    features: ['Backpack Type', '14L Tank', 'Adjustable Nozzle'],
    operatorAvailable: true,
    fuelIncluded: true,
    transportCharge: 0,
    lastService: '2024-02-05',
    distance: 15.2
  }
];

// Mock API functions
export const equipmentService = {
  getAll: async (filters?: Record<string, unknown>): Promise<Equipment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let result = [...mockEquipment];
    
    if (filters?.type) {
      result = result.filter((e) => e.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters?.maxPrice) {
      result = result.filter((e) => e.pricePerHour <= Number(filters.maxPrice));
    }
    
    return result;
  },

  getById: async (id: string): Promise<Equipment | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockEquipment.find((e) => e.id === id);
  },

  search: async (query: string): Promise<Equipment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lowerQuery = query.toLowerCase();
    return mockEquipment.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.brand.toLowerCase().includes(lowerQuery) ||
        e.type.toLowerCase().includes(lowerQuery)
    );
  }
};

export default api;