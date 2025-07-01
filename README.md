# Tutorial Completo: Micro-frontend con Angular 20 e Native Federation

## Introduzione

Questo tutorial copre la creazione di un'applicazione e-commerce completa usando micro-frontend con Angular 20 e Native Federation. L'architettura include:

- **Shell** (Host): Layout condiviso e gestione temi
- **Products**: Catalogo prodotti con filtri
- **Cart**: Carrello con checkout
- **Profile**: Login e dashboard utente

## Architettura Finale

```
┌─────────────────────────────────────────────────────────────────┐
│                           SHELL (Host)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Theme Service  │  │ Shared Layout   │  │ Shared Service  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
    ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
    │  Products   │     │    Cart     │     │   Profile   │
    │ (Remote)    │     │ (Remote)    │     │ (Remote)    │
    │ Port: 4201  │     │ Port: 4202  │     │ Port: 4203  │
    └─────────────┘     └─────────────┘     └─────────────┘
```

## Parte 1: Setup Iniziale

### 1.1 Creazione dei Progetti

```bash
# Installa Angular CLI versione 20
npm install -g @angular/cli@20

# Crea i progetti
ng new ecommerce-shell --routing --style=scss
ng new ecommerce-products --routing --style=scss
ng new ecommerce-cart --routing --style=scss
ng new ecommerce-profile --routing --style=scss

# Installa Native Federation in ogni progetto
cd ecommerce-shell
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=host --port=4200

cd ../ecommerce-products
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4201

cd ../ecommerce-cart
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4202

cd ../ecommerce-profile
yarn add @angular-architects/native-federation
ng add @angular-architects/native-federation --type=remote --port=4203
```

### 1.2 Configurazione Federation

**Shell - federation.config.js:**

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  exposes: {
    './shared-service': './src/app/shared.service.ts',
    './theme-service': './src/app/theme.service.ts',
    './shared-layout': './src/app/shared-layout.component.ts'
  },
  remotes: {
    "products": "http://localhost:4201/remoteEntry.json",
    "cart": "http://localhost:4202/remoteEntry.json",
    "profile": "http://localhost:4203/remoteEntry.json"
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

**Micro-frontend - federation.config.js (esempio Products):**

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'products',
  exposes: {
    './component': './src/app/products/products.component.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  }
});
```

### 1.3 Configurazione Main.ts (Shell)

**main.ts:**

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'products': 'http://localhost:4201/remoteEntry.json',
  'cart': 'http://localhost:4202/remoteEntry.json',
  'profile': 'http://localhost:4203/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
```

**bootstrap.ts:**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

## Parte 2: Shell - Layout Condiviso e Temi

### 2.1 Theme Service

**theme.service.ts:**

```typescript
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'corporate';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>('light');
  private themeSubject = new BehaviorSubject<Theme>('light');

  public theme$ = this.themeSubject.asObservable();
  public theme = this.currentTheme.asReadonly();

  // CSS Custom Properties per ogni tema
  private themes: Record<Theme, Record<string, string>> = {
    light: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--text-primary': '#0f172a',
      '--primary-color': '#2563eb',
      // ... altre variabili
    },
    dark: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--text-primary': '#f8fafc',
      '--primary-color': '#3b82f6',
      // ... altre variabili
    },
    corporate: {
      '--bg-primary': '#fefefe',
      '--bg-secondary': '#f5f7fa',
      '--text-primary': '#2d3748',
      '--primary-color': '#805ad5',
      // ... altre variabili
    }
  };

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('app-theme', theme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    const themeVars = this.themes[theme];

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    root.setAttribute('data-theme', theme);
  }
}
```

### 2.2 Shared Layout Component

**shared-layout.component.ts:**

- Header con logo e navigazione
- Theme switcher (3 temi)
- Carrello con badge counter
- Footer
- Routing outlet per micro-frontend

**Caratteristiche:**

- CSS Variables per temi dinamici
- Responsive design
- Badge carrello reattivo
- Controllo autenticazione

### 2.3 Shared State Service (Carrello)

**shared.service.ts:**

```typescript
// Singleton globale per condividere stato tra micro-frontend
declare global {
  interface Window {
    __SHARED_CART_SERVICE__: SharedStateService;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private static instance: SharedStateService;
  private cartItems = signal<CartItem[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Implementa singleton pattern globale
    if (window.__SHARED_CART_SERVICE__) {
      return window.__SHARED_CART_SERVICE__;
    }
    window.__SHARED_CART_SERVICE__ = this;
  }

  addToCart(product: Product, quantity: number = 1) {
    // Logica aggiunta al carrello
  }

  // Altri metodi...
}

export function getSharedCartService(): SharedStateService {
  return SharedStateService.getInstance();
}
```

### 2.4 App Component Shell

**app.ts:**

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #layoutContainer></div>
    <div *ngIf="!isLayoutLoaded" class="loading-container">
      <!-- Loading spinner -->
    </div>
  `
})
export class App implements OnInit {
  async ngOnInit() {
    const { SharedLayoutComponent } = await loadRemoteModule('shell', './shared-layout');
    this.layoutComponentRef = this.viewContainerRef.createComponent(SharedLayoutComponent);
    this.isLayoutLoaded = true;
  }
}
```

## Parte 3: Products Micro-frontend

### 3.1 Products Component

**products.component.ts:**

**Caratteristiche:**

- Catalogo prodotti con grid responsive
- Filtri per categoria (Laptop, Smartphone, Audio, Tablet)
- Ricerca in tempo reale
- Rating con stelle
- Badge "Novità" e sconti
- Aggiunta al carrello con loading state
- Notifiche toast

**Funzionalità:**

- Filtri attivi/inattivi
- Reset filtri
- Empty state
- Integrazione carrello condiviso

### 3.2 App Component Products

**app.ts:**

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `<div #layoutContainer></div>`
})
export class App implements OnInit {
  async ngOnInit() {
    // Carica layout condiviso dalla shell
    const { SharedLayoutComponent } = await loadRemoteModule('shell', './shared-layout');
    this.layoutComponentRef = this.viewContainerRef.createComponent(SharedLayoutComponent);
    this.layoutComponentRef.instance.appTitle = 'TechStore - Prodotti';
  }
}
```

## Parte 4: Cart Micro-frontend

### 4.1 Cart Component

**cart.component.ts:**

**Caratteristiche:**

- Visualizzazione articoli con immagini
- Controlli quantità (+/- e input diretto)
- Rimozione singola e svuotamento completo
- Calcoli automatici (subtotale, spedizione, IVA, totale)
- Spedizione gratuita oltre €50
- Checkout simulato con modal conferma
- Empty state con call-to-action
- Payment methods icons

**Funzionalità:**

- Aggiornamento quantità real-time
- Calcolo spedizione dinamico
- Processo checkout completo
- Notifiche per tutte le azioni

### 4.2 Integrazione Carrello

```typescript
async ngOnInit() {
  const { getSharedCartService } = await loadRemoteModule('shell', './shared-service');
  this.sharedStateService = getSharedCartService();

  this.sharedStateService.cart$.subscribe((items: any[]) => {
    this.cartItems = items;
  });
}
```

## Parte 5: Profile Micro-frontend

### 5.1 Login Component

**login.component.ts:**

**Caratteristiche:**

- Form login con validazione
- Auto-fill demo credenziali
- Loading state con spinner
- Notifiche successo/errore
- Responsive design
- Redirect automatico dopo login

**Credenziali demo:**

- Email: demo@test.com
- Password: demo123

### 5.2 Profile Component

**profile.component.ts:**

**Caratteristiche:**

- Dashboard con 3 tab (Ordini, Impostazioni, Statistiche)
- Gestione profilo utente
- Storico ordini con stati
- Statistiche personalizzate
- Form modifica dati
- Logout funzionale

### 5.3 App Component Profile

```typescript
async ngOnInit() {
  const { SharedLayoutComponent } = await loadRemoteModule('shell', './shared-layout');

  // Determina quale component caricare
  const isAuthenticated = !!sessionStorage.getItem('userToken');
  const component = isAuthenticated ? ProfileComponent : LoginComponent;
}
```

## Parte 6: Routing e Navigazione

### 6.1 Shell Routes

**app.routes.ts:**

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => loadRemoteModule('products', './component').then(m => m.ProductsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => loadRemoteModule('cart', './component').then(m => m.CartComponent)
  },
  {
    path: 'profile',
    loadComponent: () => loadRemoteModule('profile', './component').then(m => m.ProfileComponent)
  },
  {
    path: 'login',
    loadComponent: () => loadRemoteModule('profile', './login').then(m => m.LoginComponent)
  }
];
```

## Parte 7: Problemi Risolti

### 7.1 CSS Variables Non Ereditati

**Problema:** I micro-frontend non ereditavano i temi della shell.

**Soluzione:**

- Esporre ThemeService dalla shell
- Usare CSS variables in tutti i micro-frontend
- Layout condiviso con tema switcher

### 7.2 Carrello Non Condiviso

**Problema:** Ogni micro-frontend aveva il proprio stato del carrello.

**Soluzione:**

- Singleton pattern globale con `window.__SHARED_CART_SERVICE__`
- Funzione `getSharedCartService()` per accesso uniforme
- BehaviorSubject per aggiornamenti real-time

### 7.3 Warnings di Compilazione

**Problema:** Import non utilizzati nei template.

**Soluzione:**

- Caricamento dinamico dei component con `loadRemoteModule`
- Import condizionali solo quando necessario
- ViewContainerRef per component injection

## Parte 8: Avvio e Test

### 8.1 Script di Avvio

**package.json (root):**

```json
{
  "scripts": {
    "start:all": "concurrently \"npm run start:shell\" \"npm run start:products\" \"npm run start:cart\" \"npm run start:profile\"",
    "start:shell": "cd ecommerce-shell && yarn start --port 4200",
    "start:products": "cd ecommerce-products && yarn start --port 4201",
    "start:cart": "cd ecommerce-cart && yarn start --port 4202",
    "start:profile": "cd ecommerce-profile && yarn start --port 4203"
  }
}
```

### 8.2 Comandi Test

```bash
# Installa concurrently
npm install -g concurrently

# Avvia tutti i micro-frontend
npm run start:all

# Oppure manualmente
cd ecommerce-shell && yarn start --port 4200 &
cd ecommerce-products && yarn start --port 4201 &
cd ecommerce-cart && yarn start --port 4202 &
cd ecommerce-profile && yarn start --port 4203 &
```

### 8.3 URLs di Test

- **Shell**: http://localhost:4200
- **Products**: http://localhost:4200/products
- **Cart**: http://localhost:4200/cart
- **Profile**: http://localhost:4200/profile
- **Login**: http://localhost:4200/login

## Parte 9: Vantaggi Ottenuti

### 9.1 Indipendenza dei Team

- Ogni micro-frontend può essere sviluppato separatamente
- Deploy indipendenti
- Tecnologie diverse per ogni modulo

### 9.2 Condivisione Efficace

- Layout unificato con temi centrali
- Stato condiviso per carrello
- Servizi comuni accessibili

### 9.3 Scalabilità

- Aggiunta facile di nuovi micro-frontend
- Modifica indipendente di ogni modulo
- Performance ottimizzata con lazy loading

### 9.4 Manutenibilità

- Codice isolato per responsabilità
- Testing indipendente
- Debug semplificato

## Parte 11: Docker e Deployment

### 11.1 Dockerfile per ogni Micro-frontend

Ogni micro-frontend avrà il suo Dockerfile con build multi-stage:

**Dockerfile (esempio per Shell):**

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ecommerce-shell /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 11.2 Docker Compose

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  shell:
    build:
      context: ./ecommerce-shell
      dockerfile: Dockerfile
    container_name: ecommerce-shell
    ports:
      - "8080:80"
    networks:
      - microfrontend-network

  products:
    build:
      context: ./ecommerce-products
      dockerfile: Dockerfile
    container_name: ecommerce-products
    ports:
      - "8081:80"
    networks:
      - microfrontend-network

  cart:
    build:
      context: ./ecommerce-cart
      dockerfile: Dockerfile
    container_name: ecommerce-cart
    ports:
      - "8082:80"
    networks:
      - microfrontend-network

  profile:
    build:
      context: ./ecommerce-profile
      dockerfile: Dockerfile
    container_name: ecommerce-profile
    ports:
      - "8083:80"
    networks:
      - microfrontend-network

  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
    networks:
      - microfrontend-network
    depends_on:
      - shell
      - products
      - cart
      - profile

networks:
  microfrontend-network:
    driver: bridge
```

### 11.3 Script di Deploy

**deploy.sh:**

```bash
#!/bin/bash
echo "🚀 Starting deployment..."
docker-compose down
docker-compose up --build -d
echo "✅ Deployment completed!"
echo "🌐 Application available at http://localhost"
```

### 11.4 Comandi Docker

```bash
# Build e avvio
npm run deploy

# Monitoraggio
docker-compose logs -f

# Stop
docker-compose down

# Cleanup completo
docker-compose down --rmi all --volumes
```

### 11.5 URLs di Accesso

- **Applicazione principale**: http://localhost
- **Shell diretta**: http://localhost:8080
- **Products diretta**: http://localhost:8081
- **Cart diretta**: http://localhost:8082
- **Profile diretta**: http://localhost:8083

## Parte 12: Prossimi Passi

### 12.1 Miglioramenti Possibili

- Implementare autenticazione JWT reale
- Aggiungere testing end-to-end
- Configurare CI/CD pipeline separate
- Implementare error boundaries
- Ottimizzare bundle splitting

### 12.2 Produzione

- Configurare reverse proxy (nginx)
- Implementare monitoring e logging
- Setup ambiente di staging
- Ottimizzazioni performance

### 12.3 Estensioni

- Aggiungere micro-frontend Admin
- Implementare notifiche real-time
- Integrare analytics
- Multi-language support

## Conclusioni

Questo tutorial ha dimostrato come implementare un'architettura micro-frontend completa con Angular 20 e Native Federation. L'approccio consente:

- **Sviluppo indipendente** dei team
- **Condivisione efficace** di layout e stato
- **Scalabilità** dell'architettura
- **Manutenibilità** del codice

L'applicazione finale include un e-commerce completo con catalogo prodotti, carrello funzionante, sistema di autenticazione e temi multipli, tutto gestito attraverso micro-frontend indipendenti ma coordinati.

## Repository e Risorse

- **Angular 20**: https://angular.io
- **Native Federation**: https://github.com/angular-architects/native-federation
- **Micro-frontend Pattern**: https://micro-frontends.org

---

_Tutorial creato per dimostrare l'implementazione pratica di micro-frontend enterprise con Angular 20._
