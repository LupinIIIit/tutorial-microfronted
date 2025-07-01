import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-container">
      <!-- Cart Header -->
      <div class="cart-header">
        <h1 class="cart-title">Il Tuo Carrello</h1>
        <p class="cart-subtitle" *ngIf="cartItems.length > 0">
          {{ cartItems.length }}
          {{ cartItems.length === 1 ? 'articolo' : 'articoli' }} nel carrello
        </p>
      </div>

      <!-- Empty Cart State -->
      <div class="empty-cart" *ngIf="cartItems.length === 0">
        <div class="empty-cart-content">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            class="empty-cart-icon"
          >
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
            <line
              x1="12"
              x2="12"
              y1="8"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              x1="10"
              x2="14"
              y1="10"
              y2="10"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <h2>Il carrello è vuoto</h2>
          <p>Aggiungi alcuni prodotti per iniziare lo shopping!</p>
          <a href="/products" class="continue-shopping-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            Continua lo Shopping
          </a>
        </div>
      </div>

      <!-- Cart with Items -->
      <div class="cart-content" *ngIf="cartItems.length > 0">
        <!-- Cart Items -->
        <div class="cart-items-section">
          <div class="cart-items-header">
            <h2>Articoli nel Carrello</h2>
            <button
              class="clear-cart-btn"
              (click)="clearCart()"
              *ngIf="cartItems.length > 1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line
                  x1="10"
                  x2="10"
                  y1="11"
                  y2="17"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line
                  x1="14"
                  x2="14"
                  y1="11"
                  y2="17"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              Svuota Carrello
            </button>
          </div>

          <div class="cart-items-list">
            <div
              class="cart-item"
              *ngFor="let item of cartItems; trackBy: trackByItemId"
            >
              <div class="item-image">
                <img [src]="item.image" [alt]="item.name" loading="lazy" />
              </div>

              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-description" *ngIf="item.description">
                  {{ item.description }}
                </p>
                <div class="item-price">
                  €{{ item.price | number : '1.2-2' }}
                </div>
              </div>

              <div class="item-quantity">
                <label class="quantity-label">Quantità:</label>
                <div class="quantity-controls">
                  <button
                    class="quantity-btn"
                    (click)="decreaseQuantity(item)"
                    [disabled]="item.quantity <= 1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <line
                        x1="5"
                        x2="19"
                        y1="12"
                        y2="12"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </button>

                  <input
                    type="number"
                    class="quantity-input"
                    [(ngModel)]="item.quantity"
                    (change)="updateQuantity(item)"
                    min="1"
                    max="99"
                  />

                  <button class="quantity-btn" (click)="increaseQuantity(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <line
                        x1="12"
                        x2="12"
                        y1="5"
                        y2="19"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <line
                        x1="5"
                        x2="19"
                        y1="12"
                        y2="12"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="item-total">
                <div class="item-total-price">
                  €{{ item.price * item.quantity | number : '1.2-2' }}
                </div>
                <button
                  class="remove-item-btn"
                  (click)="removeItem(item.id)"
                  title="Rimuovi dal carrello"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="10"
                      x2="10"
                      y1="11"
                      y2="17"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="14"
                      x2="14"
                      y1="11"
                      y2="17"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary-section">
          <div class="cart-summary">
            <h2>Riepilogo Ordine</h2>

            <div class="summary-row">
              <span>Subtotale ({{ getTotalItems() }} articoli):</span>
              <span>€{{ getSubtotal() | number : '1.2-2' }}</span>
            </div>

            <div class="summary-row">
              <span>Spedizione:</span>
              <span
                class="shipping-free"
                *ngIf="
                  getSubtotal() >= freeShippingThreshold;
                  else shippingCost
                "
              >
                Gratuita
              </span>
              <ng-template #shippingCost>
                <span>€{{ getShippingCost() | number : '1.2-2' }}</span>
              </ng-template>
            </div>

            <div
              class="summary-row shipping-info"
              *ngIf="getSubtotal() < freeShippingThreshold"
            >
              <small>
                Spedizione gratuita per ordini superiori a €{{
                  freeShippingThreshold
                }}
                <br />
                Ti mancano €{{
                  freeShippingThreshold - getSubtotal() | number : '1.2-2'
                }}
              </small>
            </div>

            <div class="summary-row">
              <span>IVA (22%):</span>
              <span>€{{ getTax() | number : '1.2-2' }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span>Totale:</span>
              <span class="total-amount"
                >€{{ getTotal() | number : '1.2-2' }}</span
              >
            </div>

            <!-- Checkout Actions -->
            <div class="checkout-actions">
              <button
                class="checkout-btn"
                (click)="proceedToCheckout()"
                [disabled]="isProcessingCheckout"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  *ngIf="!isProcessingCheckout"
                >
                  <rect
                    x="1"
                    y="3"
                    width="15"
                    height="13"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M16 8h4l3 5v5a2 2 0 0 1-2 2h-2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle
                    cx="5.5"
                    cy="18.5"
                    r="2.5"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle
                    cx="18.5"
                    cy="18.5"
                    r="2.5"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  *ngIf="isProcessingCheckout"
                >
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
                {{
                  isProcessingCheckout
                    ? 'Elaborazione...'
                    : 'Procedi al Checkout'
                }}
              </button>

              <a href="/products" class="continue-shopping-link">
                ← Continua lo Shopping
              </a>
            </div>

            <!-- Payment Methods -->
            <div class="payment-methods">
              <p>Metodi di pagamento accettati:</p>
              <div class="payment-icons">
                <div class="payment-icon visa">VISA</div>
                <div class="payment-icon mastercard">MC</div>
                <div class="payment-icon paypal">PayPal</div>
                <div class="payment-icon apple">Apple Pay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cart-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
      }

      .cart-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .cart-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
        margin-bottom: 0.5rem;
        background: linear-gradient(
          135deg,
          var(--primary-color, #2563eb),
          var(--primary-hover, #1d4ed8)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .cart-subtitle {
        font-size: 1.1rem;
        color: var(--text-secondary, #475569);
      }

      /* Empty Cart State */
      .empty-cart {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        padding: 3rem;
      }

      .empty-cart-content {
        text-align: center;
        max-width: 400px;
      }

      .empty-cart-icon {
        color: var(--text-muted, #94a3b8);
        margin-bottom: 1.5rem;
      }

      .empty-cart h2 {
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--text-primary, #0f172a);
        margin-bottom: 0.75rem;
      }

      .empty-cart p {
        color: var(--text-secondary, #475569);
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .continue-shopping-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--primary-color, #2563eb);
        color: white;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }
      }

      /* Cart Content */
      .cart-content {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 3rem;
        align-items: start;
      }

      /* Cart Items Section */
      .cart-items-section {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      }

      .cart-items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
      }

      .cart-items-header h2 {
        font-size: 1.375rem;
        font-weight: 600;
        color: var(--text-primary, #0f172a);
        margin: 0;
      }

      .clear-cart-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: 1px solid var(--danger-color, #ef4444);
        color: var(--danger-color, #ef4444);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--danger-color, #ef4444);
          color: white;
        }
      }

      .cart-items-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 120px 1fr auto auto;
        gap: 1.5rem;
        align-items: center;
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border-color, #e2e8f0);

        &:last-child {
          border-bottom: none;
        }
      }

      .item-image {
        width: 120px;
        height: 120px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color, #e2e8f0);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-details {
        min-width: 0;
      }

      .item-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary, #0f172a);
        margin-bottom: 0.5rem;
        line-height: 1.3;
      }

      .item-description {
        color: var(--text-secondary, #475569);
        font-size: 0.875rem;
        line-height: 1.4;
        margin-bottom: 0.5rem;
      }

      .item-price {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-color, #2563eb);
      }

      .item-quantity {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .quantity-label {
        font-size: 0.75rem;
        color: var(--text-secondary, #475569);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 8px;
        overflow: hidden;
      }

      .quantity-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--bg-secondary, #f8fafc);
        border: none;
        color: var(--text-secondary, #475569);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: var(--primary-color, #2563eb);
          color: white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantity-input {
        width: 50px;
        height: 36px;
        text-align: center;
        border: none;
        background: var(--bg-primary, white);
        color: var(--text-primary, #0f172a);
        font-weight: 600;

        &:focus {
          outline: none;
          background: var(--bg-secondary, #f8fafc);
        }
      }

      .item-total {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }

      .item-total-price {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
      }

      .remove-item-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: transparent;
        border: 1px solid var(--danger-color, #ef4444);
        color: var(--danger-color, #ef4444);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--danger-color, #ef4444);
          color: white;
          transform: scale(1.05);
        }
      }

      /* Cart Summary */
      .cart-summary-section {
        position: sticky;
        top: 2rem;
      }

      .cart-summary {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      }

      .cart-summary h2 {
        font-size: 1.375rem;
        font-weight: 600;
        color: var(--text-primary, #0f172a);
        margin-bottom: 1.5rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        color: var(--text-secondary, #475569);

        &.shipping-info {
          flex-direction: column;
          align-items: flex-start;
          padding: 0.5rem 0;

          small {
            color: var(--text-muted, #94a3b8);
            font-size: 0.75rem;
            line-height: 1.4;
          }
        }

        &.total-row {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
          border-top: 1px solid var(--border-color, #e2e8f0);
          margin-top: 0.5rem;
          padding-top: 1rem;
        }
      }

      .shipping-free {
        color: var(--success-color, #10b981);
        font-weight: 600;
      }

      .total-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color, #2563eb);
      }

      .summary-divider {
        height: 1px;
        background: var(--border-color, #e2e8f0);
        margin: 1rem 0;
      }

      .checkout-actions {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .checkout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        background: var(--primary-color, #2563eb);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        svg {
          animation: spin 1s linear infinite;
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

      .continue-shopping-link {
        text-align: center;
        color: var(--text-secondary, #475569);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary-color, #2563eb);
        }
      }

      .payment-methods {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color, #e2e8f0);
        text-align: center;

        p {
          font-size: 0.875rem;
          color: var(--text-secondary, #475569);
          margin-bottom: 1rem;
        }
      }

      .payment-icons {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
      }

      .payment-icon {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary, #475569);
        background: var(--bg-secondary, #f8fafc);

        &.visa {
          color: #1a1f71;
        }
        &.mastercard {
          color: #eb001b;
        }
        &.paypal {
          color: #003087;
        }
        &.apple {
          color: #000000;
        }
      }

      /* Responsive Design */
      @media (max-width: 968px) {
        .cart-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .cart-summary-section {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .cart-title {
          font-size: 2rem;
        }

        .cart-item {
          grid-template-columns: 1fr;
          gap: 1rem;
          text-align: center;
        }

        .item-image {
          justify-self: center;
          width: 100px;
          height: 100px;
        }

        .item-quantity,
        .item-total {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .cart-items-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .clear-cart-btn {
          align-self: center;
        }
      }
    `,
  ],
})
export class CartComponent implements OnInit {
  private sharedStateService: any;
  cartItems: any[] = [];
  isProcessingCheckout = false;

  // Configurazioni
  freeShippingThreshold = 50.0;
  shippingCost = 7.99;
  taxRate = 0.22; // 22% IVA

  async ngOnInit() {
    try {
      // Carica il servizio condiviso dalla shell
      const { getSharedCartService } = await loadRemoteModule(
        'shell',
        './shared-service'
      );
      this.sharedStateService = getSharedCartService();

      // Sottoscrivi agli aggiornamenti del carrello
      this.sharedStateService.cart$.subscribe((items: any[]) => {
        this.cartItems = items;
        console.log('🛒 Cart aggiornato:', items.length, 'items');
      });

      // Carica items esistenti
      this.cartItems = this.sharedStateService.getCartItems();

      console.log('🛒 Cart: Servizio carrello collegato');
    } catch (error) {
      console.error('❌ Errore nel caricamento del servizio condiviso:', error);
    }
  }

  trackByItemId(index: number, item: any): number {
    return item.id;
  }

  removeItem(productId: number) {
    if (this.sharedStateService) {
      this.sharedStateService.removeFromCart(productId);
      this.showNotification('Articolo rimosso dal carrello', 'warning');
    }
  }
  clearCart() {
    if (confirm('Sei sicuro di voler svuotare il carrello?')) {
      if (this.sharedStateService) {
        this.sharedStateService.clearCart();
        this.showNotification('Carrello svuotato', 'info');
      }
    }
  }

  increaseQuantity(item: any) {
    if (item.quantity < 99) {
      item.quantity++;
      this.updateCartItem(item);
    }
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    }
  }

  updateQuantity(item: any) {
    // Assicura che la quantità sia valida
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > 99) {
      item.quantity = 99;
    }
    this.updateCartItem(item);
  }

  private updateCartItem(item: any) {
    if (this.sharedStateService) {
      this.sharedStateService.updateQuantity(item.id, item.quantity);
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getShippingCost(): number {
    return this.getSubtotal() >= this.freeShippingThreshold
      ? 0
      : this.shippingCost;
  }

  getTax(): number {
    return (this.getSubtotal() + this.getShippingCost()) * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  async proceedToCheckout() {
    this.isProcessingCheckout = true;

    try {
      // Simula processo di checkout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Qui implementeresti la logica di checkout reale
      const orderSummary = {
        items: this.cartItems,
        subtotal: this.getSubtotal(),
        shipping: this.getShippingCost(),
        tax: this.getTax(),
        total: this.getTotal(),
        orderId: 'ORD-' + Date.now(),
      };

      console.log('Order processed:', orderSummary);

      // Mostra conferma
      this.showCheckoutSuccess(orderSummary);

      // Svuota il carrello
      this.clearCart();
    } catch (error) {
      console.error('Errore nel checkout:', error);
      this.showNotification(
        "Errore nel processare l'ordine. Riprova.",
        'error'
      );
    } finally {
      this.isProcessingCheckout = false;
    }
  }

  private showNotification(
    message: string,
    type: 'success' | 'warning' | 'error' | 'info'
  ) {
    const colors = {
      success: 'var(--success-color, #10b981)',
      warning: 'var(--warning-color, #f59e0b)',
      error: 'var(--danger-color, #ef4444)',
      info: 'var(--primary-color, #2563eb)',
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
      max-width: 300px;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  private showCheckoutSuccess(orderSummary: any) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    modal.innerHTML = `
      <div style="
        background: var(--bg-primary, white);
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
      ">
        <div style="color: var(--success-color, #10b981); margin-bottom: 1rem;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style="margin: 0 auto;">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2 style="color: var(--text-primary, #0f172a); margin-bottom: 1rem;">Ordine Confermato!</h2>
        <p style="color: var(--text-secondary, #475569); margin-bottom: 1.5rem;">
          Il tuo ordine #${
            orderSummary.orderId
          } è stato processato con successo.
          <br>Riceverai una email di conferma a breve.
        </p>
        <div style="
          background: var(--bg-secondary, #f8fafc);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          text-align: left;
        ">
          <p style="margin: 0.25rem 0; color: var(--text-secondary, #475569);">
            <strong>Totale ordine:</strong> €${orderSummary.total.toFixed(2)}
          </p>
          <p style="margin: 0.25rem 0; color: var(--text-secondary, #475569);">
            <strong>Articoli:</strong> ${orderSummary.items.length}
          </p>
        </div>
        <button onclick="this.closest('div').remove()" style="
          background: var(--primary-color, #2563eb);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">Chiudi</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Rimuovi dopo 10 secondi se non chiuso manualmente
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
  }
}

// Funzione helper per loadRemoteModule
async function loadRemoteModule(remoteName: string, exposedModule: string) {
  const { loadRemoteModule } = await import(
    '@angular-architects/native-federation'
  );
  return loadRemoteModule(remoteName, exposedModule);
}
