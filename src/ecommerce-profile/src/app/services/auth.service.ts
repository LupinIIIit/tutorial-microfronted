import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user = this.currentUser.asReadonly();

  // Dati mock
  private mockUser: User = {
    id: 1,
    name: 'Marco Rossi',
    email: 'marco.rossi@email.com',
    avatar: 'https://picsum.photos/150/150?random=user',
    role: 'Premium Customer',
    joinDate: '2023-01-15',
  };

  private mockOrders: Order[] = [
    {
      id: 'ORD-001',
      date: '2025-06-25',
      status: 'delivered',
      total: 1299.99,
      items: 1,
    },
    {
      id: 'ORD-002',
      date: '2025-06-20',
      status: 'shipped',
      total: 199.99,
      items: 1,
    },
    {
      id: 'ORD-003',
      date: '2025-06-15',
      status: 'pending',
      total: 899.99,
      items: 1,
    },
    {
      id: 'ORD-004',
      date: '2025-06-10',
      status: 'delivered',
      total: 599.99,
      items: 1,
    },
  ];

  constructor() {
    this.checkAuthStatus();
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simula chiamata API
      setTimeout(() => {
        if (email === 'demo@test.com' && password === 'demo123') {
          this.currentUser.set(this.mockUser);
          this.isAuthenticatedSubject.next(true);
          // Simula salvataggio token
          sessionStorage.setItem('userToken', 'mock-jwt-token');
          sessionStorage.setItem('userData', JSON.stringify(this.mockUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticatedSubject.next(false);
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
  }

  private checkAuthStatus() {
    const token = sessionStorage.getItem('userToken');
    const userData = sessionStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.set(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  getOrders(): Order[] {
    return this.mockOrders;
  }

  updateProfile(userData: Partial<User>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser()) {
          const updatedUser = { ...this.currentUser()!, ...userData };
          this.currentUser.set(updatedUser);
          sessionStorage.setItem('userData', JSON.stringify(updatedUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
}
