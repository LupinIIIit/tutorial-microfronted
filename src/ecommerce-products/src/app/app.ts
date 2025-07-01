import { loadRemoteModule } from '@angular-architects/native-federation';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container per il layout condiviso -->
    <div #layoutContainer></div>

    <!-- Loading state -->
    <div *ngIf="!isLayoutLoaded" class="loading-container">
      <div class="loading-spinner">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
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
        <p>Caricamento prodotti...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-secondary, #f8fafc);
      }

      .loading-spinner {
        text-align: center;
        color: var(--primary-color, #2563eb);
      }

      .loading-spinner svg {
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      .loading-spinner p {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--text-secondary, #475569);
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class App implements OnInit {
  isLayoutLoaded = false;
  private layoutComponentRef?: ComponentRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  async ngOnInit() {
    try {
      // Carica il layout condiviso dalla shell
      const { SharedLayoutComponent } = await loadRemoteModule(
        'shell',
        './shared-layout'
      );

      // Crea il component dinamicamente
      this.layoutComponentRef = this.viewContainerRef.createComponent(
        SharedLayoutComponent
      );

      // Imposta il titolo specifico per products
      this.layoutComponentRef.instance.appTitle = 'TechStore - Prodotti';

      this.isLayoutLoaded = true;
    } catch (error) {
      console.error('Errore nel caricamento del layout condiviso:', error);
      this.showFallbackLayout();
    }
  }

  private async showFallbackLayout() {
    try {
      // Layout fallback se non riesce a caricare dalla shell
      const fallbackElement = document.createElement('div');
      fallbackElement.innerHTML = `
        <div style="min-height: 100vh; background: #f8fafc; padding: 2rem;">
          <div style="max-width: 1200px; margin: 0 auto;">
            <header style="background: #2563eb; color: white; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 2rem;">
              <h1>TechStore - Prodotti (Modalità Fallback)</h1>
            </header>
            <main id="fallback-content"></main>
          </div>
        </div>
      `;

      document.body.appendChild(fallbackElement);

      // Carica e inserisci il component products nel fallback
      const { ProductsComponent } = await import(
        './products/products.component'
      );
      const contentArea = fallbackElement.querySelector('#fallback-content');
      if (contentArea) {
        const productsComponent =
          this.viewContainerRef.createComponent(ProductsComponent);
        contentArea.appendChild(productsComponent.location.nativeElement);
      }
    } catch (error) {
      console.error('Errore anche nel fallback:', error);
      // Ultra-fallback: messaggio di errore semplice
      document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; color: #dc2626;">
          <div style="text-align: center;">
            <h1>Errore nel caricamento</h1>
            <p>Impossibile caricare il micro-frontend Products</p>
            <button onclick="window.location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
              Ricarica
            </button>
          </div>
        </div>
      `;
    } finally {
      this.isLayoutLoaded = true;
    }
  }

  ngOnDestroy() {
    if (this.layoutComponentRef) {
      this.layoutComponentRef.destroy();
    }
  }
}
