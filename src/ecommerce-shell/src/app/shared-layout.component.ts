import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SharedStateService } from './core/services/shared.service';
import { Theme, ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout" [attr.data-theme]="currentTheme">
      <!-- Header -->
      <header class="layout-header">
        <div class="header-content">
          <!-- Brand -->
          <div class="brand">
            <div class="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <h1>{{ appTitle }}</h1>
          </div>

          <!-- Navigation -->
          <nav class="main-nav">
            <ul class="nav-menu">
              <li class="nav-item">
                <a
                  routerLink="/products"
                  routerLinkActive="active"
                  class="nav-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  Prodotti
                </a>
              </li>
              <li class="nav-item">
                <a
                  routerLink="/cart"
                  routerLinkActive="active"
                  class="nav-link cart-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="8"
                      cy="21"
                      r="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <circle
                      cx="19"
                      cy="21"
                      r="1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2.05 2.05h2l.9 9h12.5l1.5-8H7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  Carrello
                  <span class="cart-badge" *ngIf="cartItems > 0">{{
                    cartItems
                  }}</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  [routerLink]="isAuthenticated ? '/profile' : '/login'"
                  routerLinkActive="active"
                  class="nav-link"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    *ngIf="isAuthenticated"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    *ngIf="!isAuthenticated"
                  >
                    <path
                      d="M15 3h6v18h-6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M10 17l5-5-5-5"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path d="M3 12h12" stroke="currentColor" stroke-width="2" />
                  </svg>
                  {{ isAuthenticated ? 'Profilo' : 'Login' }}
                </a>
              </li>
            </ul>
          </nav>

          <!-- Theme Switcher & Actions -->
          <div class="header-actions">
            <div class="theme-switcher">
              <button
                class="theme-btn"
                [class.active]="currentTheme === 'light'"
                (click)="setTheme('light')"
                title="Tema Chiaro"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </button>
              <button
                class="theme-btn"
                [class.active]="currentTheme === 'dark'"
                (click)="setTheme('dark')"
                title="Tema Scuro"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </button>
              <button
                class="theme-btn"
                [class.active]="currentTheme === 'corporate'"
                (click)="setTheme('corporate')"
                title="Tema Corporate"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M8 12h8M8 16h8M8 8h8"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </button>
            </div>

            <button class="search-btn" title="Cerca">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="m21 21-4.35-4.35"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>

            <button class="notifications-btn" title="Notifiche">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <span class="notification-dot"></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="layout-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="layout-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ appTitle }}</h3>
            <p>La tua destinazione per la tecnologia all'avanguardia</p>
          </div>
          <div class="footer-section">
            <h4>Servizi</h4>
            <ul>
              <li><a href="#">Assistenza</a></li>
              <li><a href="#">Garanzia</a></li>
              <li><a href="#">Spedizioni</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Azienda</h4>
            <ul>
              <li><a href="#">Chi siamo</a></li>
              <li><a href="#">Lavora con noi</a></li>
              <li><a href="#">Contatti</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 {{ appTitle }}. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: all 0.3s ease;
      }

      .layout-header {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-bottom: 2px solid var(--primary-color);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      [data-theme='dark'] .layout-header {
        background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
      }

      [data-theme='corporate'] .layout-header {
        background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
      }

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        gap: 2rem;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-hover)
          );
          border-radius: 8px;
          color: white;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      }

      .main-nav {
        flex: 1;
        display: flex;
        justify-content: center;
      }

      .nav-menu {
        display: flex;
        list-style: none;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s ease;
        position: relative;
        border: 1px solid transparent;

        &:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        &.active {
          color: white;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-hover)
          );
          font-weight: 600;
          border-color: var(--primary-hover);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        }
      }

      .cart-link {
        position: relative;
      }

      .cart-badge {
        position: absolute;
        top: -2px;
        right: 8px;
        background: var(--danger-color);
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.125rem 0.375rem;
        border-radius: 999px;
        min-width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .theme-switcher {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 4px;
      }

      .theme-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: scale(1.05);
        }

        &.active {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }
      }

      .search-btn,
      .notifications-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      }

      .notifications-btn {
        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--danger-color);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
      }

      .layout-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .content-wrapper {
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        padding: 2rem;
        flex: 1;
      }

      .layout-footer {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: white;
        margin-top: auto;
        border-top: 2px solid var(--primary-color);
      }

      [data-theme='dark'] .layout-footer {
        background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
      }

      [data-theme='corporate'] .layout-footer {
        background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
      }

      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 3rem 2rem 2rem;
      }

      .footer-section {
        h3,
        h4 {
          margin-bottom: 1rem;
          color: white;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            margin-bottom: 0.5rem;

            a {
              color: rgba(255, 255, 255, 0.7);
              text-decoration: none;
              transition: all 0.2s ease;

              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
      }

      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1.5rem 2rem;
        text-align: center;

        p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin: 0;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .main-nav {
          order: 3;
          width: 100%;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-actions {
          order: 2;
        }

        .content-wrapper {
          padding: 1rem;
        }

        .footer-content {
          grid-template-columns: 1fr;
          text-align: center;
          padding: 2rem 1rem 1rem;
        }
      }

      @media (max-width: 480px) {
        .brand h1 {
          font-size: 1.25rem;
        }

        .nav-link {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
      }

      router-outlet + * {
        animation: fadeInUp 0.3s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class SharedLayoutComponent implements OnInit {
  @Input() appTitle = 'TechStore';

  private themeService = inject(ThemeService);
  private sharedState = inject(SharedStateService);

  currentTheme: Theme = 'light';
  cartItems = 0;
  isAuthenticated = false;

  ngOnInit() {
    // Sottoscrizione al tema
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    // Usa il servizio singleton per il carrello
    const cartService = this.sharedState;
    cartService.cart$.subscribe((items) => {
      this.cartItems = items.reduce((total, item) => total + item.quantity, 0);
      console.log('🔢 Header: Cart count aggiornato:', this.cartItems);
    });

    // Controllo autenticazione
    this.checkAuthentication();
  }
  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  private checkAuthentication() {
    const userToken = sessionStorage.getItem('userToken');
    this.isAuthenticated = !!userToken;

    // Polling per cambiamenti auth
    setInterval(() => {
      const currentToken = sessionStorage.getItem('userToken');
      this.isAuthenticated = !!currentToken;
    }, 1000);
  }
}
