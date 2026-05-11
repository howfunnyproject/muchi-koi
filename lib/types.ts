export interface Cobbler {
  id: string;
  name: string;
  phone: string;
  area: string;
  services: string[];
  workHours?: string | null;
  workDays?: string | null;
  photos: string[];
  lat: number;
  lng: number;
  rating?: number | null;
  isNew?: boolean;
  verified?: boolean;
  createdAt?: Date | null;
}

export interface CobblerFormData {
  name: string;
  phone: string;
  area: string;
  services: string;
  workHours: string;
  workDays: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
