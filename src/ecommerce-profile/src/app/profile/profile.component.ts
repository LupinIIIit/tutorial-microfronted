import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="user-info">
            <div class="avatar">
              <img [src]="currentUser?.avatar" [alt]="currentUser?.name" />
            </div>
            <div class="user-details">
              <h1>{{ currentUser?.name }}</h1>
              <p class="role">{{ currentUser?.role }}</p>
              <p class="join-date">
                Membro dal {{ formatDate(currentUser?.joinDate || '') }}
              </p>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="16,17 21,12 16,7"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="21"
                x2="9"
                y1="12"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'orders'"
          (click)="activeTab = 'orders'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
              stroke="currentColor"
              stroke-width="2"
            />
            <rect
              x="8"
              y="2"
              width="8"
              height="4"
              rx="1"
              ry="1"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          I Miei Ordini
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'settings'"
          (click)="activeTab = 'settings'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M12 1v6m0 6v6m11-7h-6m-6 0H1"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          Impostazioni
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'stats'"
          (click)="activeTab = 'stats'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line
              x1="12"
              x2="12"
              y1="20"
              y2="10"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              x1="18"
              x2="18"
              y1="20"
              y2="4"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              x1="6"
              x2="6"
              y1="20"
              y2="16"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          Statistiche
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Orders Tab -->
        <div class="orders-tab" *ngIf="activeTab === 'orders'">
          <h2>I Tuoi Ordini</h2>
          <div class="orders-grid">
            <div class="order-card" *ngFor="let order of orders">
              <div class="order-header">
                <div class="order-id">#{{ order.id }}</div>
                <div class="order-status" [class]="'status-' + order.status">
                  {{ getStatusLabel(order.status) }}
                </div>
              </div>
              <div class="order-details">
                <div class="order-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="16"
                      x2="16"
                      y1="2"
                      y2="6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="8"
                      x2="8"
                      y1="2"
                      y2="6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="3"
                      x2="21"
                      y1="10"
                      y2="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  {{ formatDate(order.date) }}
                </div>
                <div class="order-items">{{ order.items }} articoli</div>
                <div class="order-total">
                  €{{ order.total | number : '1.2-2' }}
                </div>
              </div>
              <button class="order-details-btn">Vedi Dettagli</button>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div class="settings-tab" *ngIf="activeTab === 'settings'">
          <h2>Impostazioni Account</h2>

          <form class="settings-form" (ngSubmit)="updateProfile()">
            <div class="form-section">
              <h3>Informazioni Personali</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    [(ngModel)]="editUser.name"
                    name="name"
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    [(ngModel)]="editUser.email"
                    name="email"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Preferenze</h3>
              <div class="form-row">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="notifications.email"
                      name="emailNotifications"
                    />
                    <span class="checkmark"></span>
                    Notifiche via email
                  </label>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="notifications.sms"
                      name="smsNotifications"
                    />
                    <span class="checkmark"></span>
                    Notifiche SMS
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="isSaving">
                <span *ngIf="!isSaving">Salva Modifiche</span>
                <span *ngIf="isSaving">Salvataggio...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Stats Tab -->
        <div class="stats-tab" *ngIf="activeTab === 'stats'">
          <h2>Le Tue Statistiche</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="stat-value">{{ orders.length }}</div>
              <div class="stat-label">Ordini Totali</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="12"
                    x2="12"
                    y1="2"
                    y2="22"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="stat-value">€{{ getTotalSpent() }}</div>
              <div class="stat-label">Spesa Totale</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 12h-4l-3 9L9 3l-3 9H2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="stat-value">{{ getAverageOrder() }}</div>
              <div class="stat-label">Ordine Medio</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="stat-value">{{ getDeliveredOrders() }}</div>
              <div class="stat-label">Consegnati</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
      }

      .profile-header {
        background: linear-gradient(
          135deg,
          var(--primary-color, #2563eb) 0%,
          var(--primary-hover, #1d4ed8) 100%
        );
        border-radius: 16px;
        padding: 2rem;
        color: white;
        margin-bottom: 2rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.2);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-details {
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          margin: 0 0 0.25rem 0;
        }

        .role {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 0.25rem;
          margin: 0 0 0.25rem 0;
        }

        .join-date {
          font-size: 0.875rem;
          opacity: 0.8;
          margin: 0;
        }
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
      }

      .tab-navigation {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--border-color, #e5e7eb);
      }

      .tab-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        padding: 1rem 1.5rem;
        color: var(--text-secondary, #6b7280);
        font-weight: 500;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s ease;

        &:hover {
          color: var(--primary-color, #2563eb);
          background: var(--bg-secondary, #f8fafc);
        }

        &.active {
          color: var(--primary-color, #2563eb);
          border-bottom-color: var(--primary-color, #2563eb);
          background: var(--bg-secondary, #f8fafc);
        }
      }

      .tab-content {
        min-height: 400px;
      }

      // Orders Tab
      .orders-tab h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: var(--text-primary, #1f2937);
      }

      .orders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .order-card {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transform: translateY(-1px);
        }
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .order-id {
        font-weight: 700;
        color: var(--text-primary, #1f2937);
      }

      .order-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;

        &.status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        &.status-shipped {
          background: #dbeafe;
          color: #1e40af;
        }

        &.status-delivered {
          background: #d1fae5;
          color: #065f46;
        }

        &.status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
      }

      .order-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .order-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary, #6b7280);
        font-size: 0.875rem;
      }

      .order-items {
        color: var(--text-secondary, #6b7280);
        font-size: 0.875rem;
      }

      .order-total {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--text-primary, #1f2937);
      }

      .order-details-btn {
        background: var(--primary-color, #2563eb);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-1px);
        }
      }

      // Settings Tab
      .settings-tab h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: var(--text-primary, #1f2937);
      }

      .settings-form {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      }

      .form-section {
        margin-bottom: 2rem;

        h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .form-group {
        label {
          display: block;
          font-weight: 500;
          color: var(--text-primary, #374151);
          margin-bottom: 0.5rem;
        }

        input[type='text'],
        input[type='email'] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 6px;
          font-size: 1rem;
          background: var(--bg-primary, white);
          color: var(--text-primary, #0f172a);
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: var(--primary-color, #2563eb);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
        }
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: 400 !important;

        input[type='checkbox'] {
          margin-right: 0.5rem;
          width: 1rem;
          height: 1rem;
        }
      }

      .form-actions {
        text-align: right;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color, #e5e7eb);
      }

      .save-btn {
        background: var(--primary-color, #2563eb);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      // Stats Tab
      .stats-tab h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: var(--text-primary, #1f2937);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .stat-card {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transform: translateY(-2px);
        }
      }

      .stat-icon {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        color: var(--primary-color, #2563eb);
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary, #1f2937);
        margin-bottom: 0.5rem;
      }

      .stat-label {
        color: var(--text-secondary, #6b7280);
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .profile-container {
          padding: 1rem;
        }

        .header-content {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .tab-navigation {
          flex-direction: column;
          gap: 0;

          .tab-btn {
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            border-radius: 0;

            &.active {
              border-left: 3px solid var(--primary-color, #2563eb);
              border-bottom-color: var(--border-color, #e5e7eb);
            }
          }
        }

        .orders-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  orders: Order[] = [];
  activeTab = 'orders';

  editUser = {
    name: '',
    email: '',
  };

  notifications = {
    email: true,
    sms: false,
  };

  isSaving = false;

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

  async ngOnInit() {
    // Carica dati utente
    this.loadUserData();
    this.orders = this.mockOrders;

    // Inizializza form di editing
    if (this.currentUser) {
      this.editUser = {
        name: this.currentUser.name,
        email: this.currentUser.email,
      };
    }
  }

  private loadUserData() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch {
        this.currentUser = this.mockUser;
      }
    } else {
      this.currentUser = this.mockUser;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusLabel(status: string): string {
    const labels = {
      pending: 'In Attesa',
      shipped: 'Spedito',
      delivered: 'Consegnato',
      cancelled: 'Annullato',
    };
    return labels[status as keyof typeof labels] || status;
  }

  getTotalSpent(): string {
    const total = this.orders.reduce((sum, order) => sum + order.total, 0);
    return total.toFixed(2);
  }

  getAverageOrder(): string {
    if (this.orders.length === 0) return '0.00';
    const average =
      this.orders.reduce((sum, order) => sum + order.total, 0) /
      this.orders.length;
    return `€${average.toFixed(2)}`;
  }

  getDeliveredOrders(): number {
    return this.orders.filter((order) => order.status === 'delivered').length;
  }

  async updateProfile() {
    this.isSaving = true;

    try {
      // Simula aggiornamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (this.currentUser) {
        this.currentUser.name = this.editUser.name;
        this.currentUser.email = this.editUser.email;

        // Aggiorna sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(this.currentUser));
      }

      this.showNotification('Profilo aggiornato con successo!', 'success');
    } catch (error) {
      this.showNotification("Errore nell'aggiornamento del profilo", 'error');
    } finally {
      this.isSaving = false;
    }
  }

  logout() {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    window.location.href = '/login';
  }

  private showNotification(message: string, type: 'success' | 'error') {
    const colors = {
      success: 'var(--success-color, #10b981)',
      error: 'var(--danger-color, #ef4444)',
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${colors[type]};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}
