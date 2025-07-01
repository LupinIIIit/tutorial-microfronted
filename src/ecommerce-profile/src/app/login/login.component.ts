import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M8 14s1.5 2 4 2 4-2 4-2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="9"
                x2="9.01"
                y1="9"
                y2="9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="15"
                x2="15.01"
                y1="9"
                y2="9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h1>Benvenuto!</h1>
          <p>Accedi al tuo account TechStore</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <polyline
                  points="22,6 12,13 2,6"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="loginData.email"
                placeholder="La tua email"
                required
                [class.error]="hasError && !loginData.email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="loginData.password"
                placeholder="La tua password"
                required
                [class.error]="hasError && !loginData.password"
              />
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                [(ngModel)]="rememberMe"
                name="rememberMe"
              />
              <span class="checkmark"></span>
              Ricordami
            </label>
            <a href="#" class="forgot-link">Password dimenticata?</a>
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="isLoading"
            [class.loading]="isLoading"
          >
            <span *ngIf="!isLoading">Accedi</span>
            <span *ngIf="isLoading" class="loading-spinner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Accesso in corso...
            </span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="15"
                x2="9"
                y1="9"
                y2="15"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="9"
                x2="15"
                y1="9"
                y2="15"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            {{ errorMessage }}
          </div>

          <div class="demo-info">
            <h4>Account Demo:</h4>
            <p><strong>Email:</strong> demo&#64;test.com</p>
            <p><strong>Password:</strong> demo123</p>
            <button type="button" class="demo-fill-btn" (click)="fillDemo()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Compila Automaticamente
            </button>
          </div>
        </form>

        <div class="login-footer">
          <p>Non hai un account? <a href="#">Registrati</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .login-card {
        background: var(--bg-primary, white);
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
        width: 100%;
        max-width: 450px;
        overflow: hidden;
        border: 1px solid var(--border-color, #e2e8f0);
      }

      .login-header {
        background: linear-gradient(
          135deg,
          var(--primary-color, #2563eb) 0%,
          var(--primary-hover, #1d4ed8) 100%
        );
        color: white;
        padding: 2rem;
        text-align: center;

        .logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;

          svg {
            color: white;
          }
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          margin: 0 0 0.5rem 0;
        }

        p {
          opacity: 0.9;
          font-size: 0.95rem;
          margin: 0;
        }
      }

      .login-form {
        padding: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          font-weight: 600;
          color: var(--text-primary, #374151);
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
      }

      .input-wrapper {
        position: relative;

        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted, #9ca3af);
          z-index: 1;
          pointer-events: none;
        }

        input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3.5rem;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: var(--bg-primary, white);
          color: var(--text-primary, #374151);
          min-height: 48px;
          box-sizing: border-box;

          &:focus {
            outline: none;
            border-color: var(--primary-color, #2563eb);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          &.error {
            border-color: var(--danger-color, #ef4444);
          }

          &::placeholder {
            color: var(--text-muted, #9ca3af);
            font-size: 0.95rem;
          }
        }
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
      }

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--text-secondary, #475569);

        input[type='checkbox'] {
          margin-right: 0.5rem;
          width: 1rem;
          height: 1rem;
          accent-color: var(--primary-color, #2563eb);
        }
      }

      .forgot-link {
        color: var(--primary-color, #2563eb);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-hover, #1d4ed8);
          text-decoration: underline;
        }
      }

      .login-btn {
        width: 100%;
        background: linear-gradient(
          135deg,
          var(--primary-color, #2563eb) 0%,
          var(--primary-hover, #1d4ed8) 100%
        );
        color: white;
        border: none;
        padding: 0.875rem 1.5rem;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 1rem;
        min-height: 48px;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        &.loading {
          .loading-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            svg {
              animation: spin 1s linear infinite;
            }
          }
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--danger-color, #ef4444);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .demo-info {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;

        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--success-color, #10b981);
          margin-bottom: 0.5rem;
          margin: 0 0 0.5rem 0;
        }

        p {
          font-size: 0.8rem;
          color: var(--text-secondary, #475569);
          margin: 0.25rem 0;
        }

        .demo-fill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--success-color, #10b981);
          color: white;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;

          &:hover {
            background: #059669;
            transform: translateY(-1px);
          }
        }
      }

      .login-footer {
        text-align: center;
        padding: 1.5rem 2rem;
        border-top: 1px solid var(--border-color, #e5e7eb);
        color: var(--text-secondary, #6b7280);

        a {
          color: var(--primary-color, #2563eb);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;

          &:hover {
            color: var(--primary-hover, #1d4ed8);
            text-decoration: underline;
          }
        }
      }

      @media (max-width: 480px) {
        .login-container {
          padding: 1rem;
          min-height: calc(100vh - 160px);
        }

        .login-header {
          padding: 1.5rem;
        }

        .login-form {
          padding: 1.5rem;
        }

        .login-footer {
          padding: 1rem 1.5rem;
        }
      }
    `,
  ],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  hasError = false;

  // Dati mock per il login
  private mockUser = {
    id: 1,
    name: 'Marco Rossi',
    email: 'demo@test.com',
    avatar: 'https://picsum.photos/150/150?random=user',
    role: 'Premium Customer',
    joinDate: '2023-01-15',
  };

  fillDemo() {
    this.loginData.email = 'demo@test.com';
    this.loginData.password = 'demo123';
    this.errorMessage = '';
    this.hasError = false;
  }

  async onSubmit() {
    this.errorMessage = '';
    this.hasError = false;

    // Validazione
    if (!this.loginData.email || !this.loginData.password) {
      this.hasError = true;
      this.errorMessage = 'Per favore compila tutti i campi';
      return;
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.hasError = true;
      this.errorMessage = 'Inserisci un indirizzo email valido';
      return;
    }

    this.isLoading = true;

    try {
      // Simula chiamata API
      await this.simulateLogin();

      if (
        this.loginData.email === 'demo@test.com' &&
        this.loginData.password === 'demo123'
      ) {
        // Login riuscito
        sessionStorage.setItem('userToken', 'mock-jwt-token-' + Date.now());
        sessionStorage.setItem('userData', JSON.stringify(this.mockUser));

        // Mostra messaggio di successo
        this.showSuccessMessage();

        // Reindirizza dopo un breve delay
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      } else {
        this.errorMessage = 'Email o password non corretti';
        this.hasError = true;
      }
    } catch (error) {
      this.errorMessage = 'Errore durante il login. Riprova.';
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  private async simulateLogin(): Promise<void> {
    // Simula latency di rete
    return new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });
  }

  private showSuccessMessage() {
    // Crea notifica di successo
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--success-color, #10b981);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Login effettuato con successo!</span>
      </div>
    `;

    // Aggiungi animazione CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Rimuovi dopo 3 secondi
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }
}
