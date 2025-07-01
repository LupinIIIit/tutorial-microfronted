import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Singleton globale per condividere stato tra micro-frontend
declare global {
  interface Window {
    __SHARED_CART_SERVICE__: SharedStateService;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private static instance: SharedStateService;
  private cartItems = signal<CartItem[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  public cart$ = this.cartSubject.asObservable();
  public cartCount = this.cartItems.asReadonly();

  constructor() {
    // Implementa singleton pattern globale
    if (window.__SHARED_CART_SERVICE__) {
      return window.__SHARED_CART_SERVICE__;
    }

    window.__SHARED_CART_SERVICE__ = this;
    SharedStateService.instance = this;

    console.log('🛒 SharedStateService inizializzato');
  }

  static getInstance(): SharedStateService {
    if (!SharedStateService.instance) {
      SharedStateService.instance = new SharedStateService();
    }
    return SharedStateService.instance;
  }

  addToCart(product: Product, quantity: number = 1) {
    console.log('🛒 Aggiunto al carrello:', product.name, 'Qty:', quantity);

    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === product.id
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Aggiorna quantità item esistente
      newItems = [...currentItems];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Aggiungi nuovo item
      newItems = [...currentItems, { ...product, quantity }];
    }

    this.cartItems.set(newItems);
    this.cartSubject.next(newItems);

    console.log('🛒 Carrello aggiornato:', newItems.length, 'items');
  }

  removeFromCart(productId: number) {
    console.log('🛒 Rimosso dal carrello ID:', productId);

    const filtered = this.cartItems().filter((item) => item.id !== productId);
    this.cartItems.set(filtered);
    this.cartSubject.next(filtered);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex((item) => item.id === productId);

    if (itemIndex >= 0) {
      const newItems = [...currentItems];
      newItems[itemIndex] = { ...newItems[itemIndex], quantity };
      this.cartItems.set(newItems);
      this.cartSubject.next(newItems);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems();
  }

  getCartTotal(): number {
    return this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getCartCount(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.cartItems.set([]);
    this.cartSubject.next([]);
  }
}

// Funzione helper per ottenere l'istanza singleton
export function getSharedCartService(): SharedStateService {
  return SharedStateService.getInstance();
}
