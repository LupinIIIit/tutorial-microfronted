import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <div class="products-header">
        <h1 class="products-title">Catalogo Prodotti</h1>
        <p class="products-subtitle">
          Scopri i nostri prodotti tecnologici all'avanguardia
        </p>

        <!-- Filtri -->
        <div class="filters-section">
          <div class="search-filter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            <input
              type="text"
              placeholder="Cerca prodotti..."
              [(ngModel)]="searchTerm"
              (input)="filterProducts()"
              class="search-input"
            />
          </div>

          <div class="category-filters">
            <button
              class="filter-btn"
              [class.active]="selectedCategory === 'all'"
              (click)="filterByCategory('all')"
            >
              Tutti
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCategory === 'laptop'"
              (click)="filterByCategory('laptop')"
            >
              Laptop
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCategory === 'smartphone'"
              (click)="filterByCategory('smartphone')"
            >
              Smartphone
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCategory === 'audio'"
              (click)="filterByCategory('audio')"
            >
              Audio
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCategory === 'tablet'"
              (click)="filterByCategory('tablet')"
            >
              Tablet
            </button>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div class="product-card" *ngFor="let product of filteredProducts">
          <div class="product-image">
            <img [src]="product.image" [alt]="product.name" loading="lazy" />
            <div class="product-badge" *ngIf="product.isNew">Novità</div>
            <div class="product-discount" *ngIf="product.discount">
              -{{ product.discount }}%
            </div>
          </div>

          <div class="product-info">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>

            <div class="product-rating">
              <div class="stars">
                <span
                  *ngFor="let star of getStars(product.rating)"
                  [class]="star"
                  >★</span
                >
              </div>
              <span class="rating-text"
                >({{ product.reviews }} recensioni)</span
              >
            </div>

            <div class="product-price-section">
              <div class="price-container">
                <span class="current-price">€{{ product.price }}</span>
                <span class="original-price" *ngIf="product.originalPrice"
                  >€{{ product.originalPrice }}</span
                >
              </div>

              <button
                class="add-to-cart-btn"
                (click)="addToCart(product)"
                [disabled]="isAddingToCart[product.id]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  *ngIf="!isAddingToCart[product.id]"
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
                </svg>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  *ngIf="isAddingToCart[product.id]"
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
                {{ isAddingToCart[product.id] ? 'Aggiunta...' : 'Aggiungi' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredProducts.length === 0">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke="currentColor"
            stroke-width="2"
          />
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" />
        </svg>
        <h3>Nessun prodotto trovato</h3>
        <p>Prova a modificare i filtri di ricerca</p>
        <button class="reset-filters-btn" (click)="resetFilters()">
          Mostra tutti i prodotti
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .products-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0;
      }

      .products-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .products-title {
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

      .products-subtitle {
        font-size: 1.1rem;
        color: var(--text-secondary, #475569);
        margin-bottom: 2rem;
      }

      .filters-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
      }

      .search-filter {
        position: relative;
        max-width: 400px;
        width: 100%;
      }

      .search-filter svg {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted, #94a3b8);
      }

      .search-input {
        width: 100%;
        padding: 0.875rem 1rem 0.875rem 3rem;
        border: 2px solid var(--border-color, #e2e8f0);
        border-radius: 12px;
        font-size: 1rem;
        background: var(--bg-primary, white);
        color: var(--text-primary, #0f172a);
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color, #2563eb);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        &::placeholder {
          color: var(--text-muted, #94a3b8);
        }
      }

      .category-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .filter-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--border-color, #e2e8f0);
        background: var(--bg-primary, white);
        color: var(--text-secondary, #475569);
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--primary-color, #2563eb);
          color: var(--primary-color, #2563eb);
          transform: translateY(-1px);
        }

        &.active {
          background: var(--primary-color, #2563eb);
          border-color: var(--primary-color, #2563eb);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }

      .product-card {
        background: var(--bg-primary, white);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          border-color: var(--primary-color, #2563eb);
        }
      }

      .product-image {
        position: relative;
        height: 240px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      .product-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: var(--success-color, #10b981);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .product-discount {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--danger-color, #ef4444);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .product-info {
        padding: 1.5rem;
      }

      .product-category {
        font-size: 0.875rem;
        color: var(--primary-color, #2563eb);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }

      .product-name {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
        margin-bottom: 0.5rem;
        line-height: 1.3;
      }

      .product-description {
        color: var(--text-secondary, #475569);
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .product-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .stars {
        display: flex;
        gap: 2px;

        .star {
          color: #fbbf24;
          font-size: 1rem;
        }

        .empty {
          color: var(--border-color, #e2e8f0);
        }
      }

      .rating-text {
        font-size: 0.875rem;
        color: var(--text-muted, #94a3b8);
      }

      .product-price-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
      }

      .price-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .current-price {
        font-size: 1.375rem;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
      }

      .original-price {
        font-size: 1rem;
        color: var(--text-muted, #94a3b8);
        text-decoration: line-through;
      }

      .add-to-cart-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--primary-color, #2563eb);
        color: white;
        border: none;
        padding: 0.75rem 1.25rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
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

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-muted, #94a3b8);

        svg {
          margin-bottom: 1rem;
          color: var(--text-muted, #94a3b8);
        }

        h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-secondary, #475569);
          margin-bottom: 0.5rem;
        }

        p {
          margin-bottom: 2rem;
        }
      }

      .reset-filters-btn {
        background: var(--primary-color, #2563eb);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--primary-hover, #1d4ed8);
          transform: translateY(-1px);
        }
      }

      @media (max-width: 768px) {
        .products-title {
          font-size: 2rem;
        }

        .filters-section {
          gap: 1rem;
        }

        .category-filters {
          gap: 0.25rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .product-price-section {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .add-to-cart-btn {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class ProductsComponent implements OnInit {
  private sharedStateService: any;

  // Dati prodotti estesi
  allProducts = [
    {
      id: 1,
      name: 'Laptop Gaming Pro X1',
      price: 1299.99,
      originalPrice: 1499.99,
      image: 'https://picsum.photos/320/240?random=1',
      category: 'laptop',
      description: 'Laptop da gaming di ultima generazione con GPU RTX 4070',
      rating: 4.8,
      reviews: 124,
      isNew: true,
      discount: 13,
    },
    {
      id: 2,
      name: 'Smartphone Pro Max',
      price: 899.99,
      image: 'https://picsum.photos/320/240?random=2',
      category: 'smartphone',
      description: 'Smartphone flagship con fotocamera avanzata e 5G',
      rating: 4.6,
      reviews: 89,
      isNew: false,
      discount: 0,
    },
    {
      id: 3,
      name: 'Cuffie Wireless Premium',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://picsum.photos/320/240?random=3',
      category: 'audio',
      description: 'Cuffie con cancellazione attiva del rumore e audio hi-fi',
      rating: 4.7,
      reviews: 156,
      isNew: false,
      discount: 20,
    },
    {
      id: 4,
      name: 'Tablet Ultra 12"',
      price: 599.99,
      image: 'https://picsum.photos/320/240?random=4',
      category: 'tablet',
      description: 'Tablet professionale con display Retina e stylus incluso',
      rating: 4.5,
      reviews: 67,
      isNew: true,
      discount: 0,
    },
    {
      id: 5,
      name: 'Laptop Business Elite',
      price: 1099.99,
      image: 'https://picsum.photos/320/240?random=5',
      category: 'laptop',
      description: 'Laptop ultrabook per professionisti con 16GB RAM',
      rating: 4.4,
      reviews: 93,
      isNew: false,
      discount: 0,
    },
    {
      id: 6,
      name: 'Auricolari Sport',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://picsum.photos/320/240?random=6',
      category: 'audio',
      description: 'Auricolari wireless resistenti al sudore per lo sport',
      rating: 4.3,
      reviews: 201,
      isNew: false,
      discount: 20,
    },
  ];

  filteredProducts = [...this.allProducts];
  searchTerm = '';
  selectedCategory = 'all';
  isAddingToCart: { [key: number]: boolean } = {};

  async ngOnInit() {
    // Carica il servizio condiviso dalla shell
    try {
      const { getSharedCartService } = await loadRemoteModule(
        'shell',
        './shared-service'
      );
      this.sharedStateService = getSharedCartService();
      console.log('📦 Products: Servizio carrello collegato');
    } catch (error) {
      console.error('❌ Errore nel caricamento del servizio condiviso:', error);
    }
  }

  filterProducts() {
    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filteredProducts = [...this.allProducts];
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star');
    }

    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }

  async addToCart(product: any) {
    if (!this.sharedStateService) {
      console.error('❌ Servizio carrello non disponibile');
      alert('Servizio carrello non disponibile');
      return;
    }

    this.isAddingToCart[product.id] = true;

    try {
      // Simula latency di rete
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Aggiungi al carrello usando il servizio singleton
      this.sharedStateService.addToCart(product, 1);

      // Mostra notifica di successo
      this.showSuccessNotification(product.name);

      console.log('✅ Prodotto aggiunto con successo:', product.name);
    } catch (error) {
      console.error("❌ Errore nell'aggiunta al carrello:", error);
      alert("Errore nell'aggiunta al carrello");
    } finally {
      this.isAddingToCart[product.id] = false;
    }
  }

  private showSuccessNotification(productName: string) {
    // Crea notifica toast semplice
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
        <span><strong>${productName}</strong> aggiunto al carrello!</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Rimuovi dopo 3 secondi
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Funzione helper per loadRemoteModule
async function loadRemoteModule(remoteName: string, exposedModule: string) {
  const { loadRemoteModule } = await import(
    '@angular-architects/native-federation'
  );
  return loadRemoteModule(remoteName, exposedModule);
}
