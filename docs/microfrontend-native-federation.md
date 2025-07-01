# Micro-frontend E-commerce con Native Federation - Angular 20

## Architettura dell'esempio

Creeremo 4 applicazioni:

-   **Shell App** (Host) - Navbar, routing principale
-   **Products** (Remote) - Catalogo prodotti
-   **Cart** (Remote) - Carrello e checkout
-   **Profile** (Remote) - Profilo utente

## 1. Setup iniziale

### Installazione Native Federation

```bash
npm install -g @angular/cli@20
npm install @angular-architects/native-federation
```

### Creazione delle applicazioni

```bash
# Shell (Host)
ng new ecommerce-shell --routing --style=scss
cd ecommerce-shell
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=host --port=4200

# Products (Remote)
ng new ecommerce-products --routing --style=scss
cd ecommerce-products
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4201

# Cart (Remote)
ng new ecommerce-cart --routing --style=scss
cd ecommerce-cart
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4202

# Profile (Remote)
ng new ecommerce-profile --routing --style=scss
cd ecommerce-profile
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4203
```

## 2. Configurazione Shell App (Host)

### federation.config.js

```javascript
const {
    withNativeFederation,
    shareAll,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
    remotes: {
        products: 'http://localhost:4201/remoteEntry.json',
        cart: 'http://localhost:4202/remoteEntry.json',
        profile: 'http://localhost:4203/remoteEntry.json',
    },
    shared: {
        ...shareAll({
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
        }),
    },
    skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

### app.routes.ts (Shell)

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full',
    },
    {
        path: 'products',
        loadChildren: () =>
            loadRemoteModule('products', './routes').then(
                (m) => m.PRODUCT_ROUTES
            ),
    },
    {
        path: 'cart',
        loadChildren: () =>
            loadRemoteModule('cart', './routes').then((m) => m.CART_ROUTES),
    },
    {
        path: 'profile',
        loadChildren: () =>
            loadRemoteModule('profile', './routes').then(
                (m) => m.PROFILE_ROUTES
            ),
    },
];
```

### app.component.html (Shell)

```html
<nav class="navbar">
    <div class="nav-container">
        <h1>E-Commerce Platform</h1>
        <ul class="nav-menu">
            <li>
                <a routerLink="/products" routerLinkActive="active">Prodotti</a>
            </li>
            <li>
                <a routerLink="/cart" routerLinkActive="active"
                    >Carrello ({{cartItems}})</a
                >
            </li>
            <li>
                <a routerLink="/profile" routerLinkActive="active">Profilo</a>
            </li>
        </ul>
    </div>
</nav>
<main class="main-content">
    <router-outlet></router-outlet>
</main>
```

### shared.service.ts (Shell) - Stato condiviso

```typescript
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
}

@Injectable({
    providedIn: 'root',
})
export class SharedStateService {
    private cartItems = signal<CartItem[]>([]);
    private cartSubject = new BehaviorSubject<CartItem[]>([]);

    cart$ = this.cartSubject.asObservable();
    cartCount = this.cartItems.asReadonly();

    addToCart(product: Product, quantity: number = 1) {
        const currentItems = this.cartItems();
        const existingItem = currentItems.find(
            (item) => item.id === product.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            this.cartItems.set([...currentItems]);
        } else {
            this.cartItems.set([...currentItems, { ...product, quantity }]);
        }

        this.cartSubject.next(this.cartItems());
    }

    removeFromCart(productId: number) {
        const filtered = this.cartItems().filter(
            (item) => item.id !== productId
        );
        this.cartItems.set(filtered);
        this.cartSubject.next(filtered);
    }

    getCartTotal(): number {
        return this.cartItems().reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }
}
```

## 3. Products Remote

### federation.config.js (Products)

```javascript
const {
    withNativeFederation,
    shareAll,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
    name: 'products',
    exposes: {
        './routes': './src/app/products.routes.ts',
        './component': './src/app/products/products.component.ts',
    },
    shared: {
        ...shareAll({
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
        }),
    },
});
```

### products.routes.ts

```typescript
import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';

export const PRODUCT_ROUTES: Routes = [
    {
        path: '',
        component: ProductsComponent,
    },
];
```

### products.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedStateService, Product } from '../shared.service';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="products-container">
            <h2>Catalogo Prodotti</h2>
            <div class="products-grid">
                <div class="product-card" *ngFor="let product of products">
                    <img [src]="product.image" [alt]="product.name" />
                    <h3>{{ product.name }}</h3>
                    <p class="price">€{{ product.price }}</p>
                    <button (click)="addToCart(product)" class="add-btn">
                        Aggiungi al Carrello
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                padding: 20px;
            }
            .product-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            .product-card img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                margin-bottom: 10px;
            }
            .price {
                font-size: 1.2em;
                font-weight: bold;
                color: #e74c3c;
            }
            .add-btn {
                background: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            }
        `,
    ],
})
export class ProductsComponent implements OnInit {
    private sharedState = inject(SharedStateService);

    products: Product[] = [
        {
            id: 1,
            name: 'Laptop Gaming',
            price: 1299.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: 2,
            name: 'Smartphone Pro',
            price: 899.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: 3,
            name: 'Cuffie Wireless',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: 4,
            name: 'Tablet Ultra',
            price: 599.99,
            image: 'https://via.placeholder.com/300x200',
        },
    ];

    ngOnInit() {
        console.log('Products micro-frontend caricato!');
    }

    addToCart(product: Product) {
        this.sharedState.addToCart(product);
        alert(`${product.name} aggiunto al carrello!`);
    }
}
```

## 4. Cart Remote

### federation.config.js (Cart)

```javascript
const {
    withNativeFederation,
    shareAll,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
    name: 'cart',
    exposes: {
        './routes': './src/app/cart.routes.ts',
        './component': './src/app/cart/cart.component.ts',
    },
    shared: {
        ...shareAll({
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
        }),
    },
});
```

### cart.component.ts

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedStateService, CartItem } from '../shared.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="cart-container">
            <h2>Il Tuo Carrello</h2>
            <div *ngIf="cartItems.length === 0" class="empty-cart">
                <p>Il carrello è vuoto</p>
                <a routerLink="/products">Continua lo shopping</a>
            </div>

            <div *ngIf="cartItems.length > 0">
                <div class="cart-item" *ngFor="let item of cartItems">
                    <img [src]="item.image" [alt]="item.name" />
                    <div class="item-details">
                        <h3>{{ item.name }}</h3>
                        <p>Quantità: {{ item.quantity }}</p>
                        <p class="price">
                            €{{ item.price * item.quantity | number : '1.2-2' }}
                        </p>
                    </div>
                    <button (click)="removeItem(item.id)" class="remove-btn">
                        Rimuovi
                    </button>
                </div>

                <div class="cart-total">
                    <h3>Totale: €{{ getTotal() | number : '1.2-2' }}</h3>
                    <button class="checkout-btn" (click)="checkout()">
                        Procedi al Checkout
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .cart-container {
                padding: 20px;
            }
            .cart-item {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #eee;
                padding: 15px 0;
            }
            .cart-item img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                margin-right: 15px;
            }
            .item-details {
                flex: 1;
            }
            .remove-btn {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            .cart-total {
                margin-top: 20px;
                text-align: right;
            }
            .checkout-btn {
                background: #27ae60;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
            }
        `,
    ],
})
export class CartComponent implements OnInit {
    private sharedState = inject(SharedStateService);
    cartItems: CartItem[] = [];

    ngOnInit() {
        this.sharedState.cart$.subscribe((items) => {
            this.cartItems = items;
        });
    }

    removeItem(productId: number) {
        this.sharedState.removeFromCart(productId);
    }

    getTotal(): number {
        return this.sharedState.getCartTotal();
    }

    checkout() {
        alert("Checkout completato! Grazie per l'acquisto.");
        // Qui implementeresti la logica di checkout reale
    }
}
```

## 5. Script di avvio

### package.json (Root) - Script per avviare tutto

```json
{
    "scripts": {
        "start:all": "concurrently \"npm run start:shell\" \"npm run start:products\" \"npm run start:cart\" \"npm run start:profile\"",
        "start:shell": "cd ecommerce-shell && ng serve",
        "start:products": "cd ecommerce-products && ng serve --port 4201",
        "start:cart": "cd ecommerce-cart && ng serve --port 4202",
        "start:profile": "cd ecommerce-profile && ng serve --port 4203"
    }
}
```

## 6. Avvio dell'applicazione

```bash
# Installa concurrently per avviare tutto insieme
npm install -g concurrently

# Avvia tutte le applicazioni
npm run start:all
```

## Vantaggi di questo approccio

1. **Indipendenza dei team**: Ogni micro-frontend può essere sviluppato indipendentemente
2. **Tecnologie diverse**: Ogni team può usare versioni diverse di Angular
3. **Deploy indipendente**: Ogni app può essere deployata separatamente
4. **Condivisione stato**: Gestione centralizzata dello stato condiviso
5. **Lazy loading**: Caricamento ottimizzato delle risorse

## Prossimi passi

-   Implementare autenticazione condivisa
-   Aggiungere testing end-to-end
-   Configurare CI/CD pipeline separate
-   Implementare error boundaries
-   Ottimizzare il bundle splitting
