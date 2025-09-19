export interface User {
  id: string;
  email: string;
  role: "Admin" | "SuperAdmin";
}

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isActive: boolean;
}