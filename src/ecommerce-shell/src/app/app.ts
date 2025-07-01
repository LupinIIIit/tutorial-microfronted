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
    <!-- Container per il layout dinamico -->
    <div #layoutContainer></div>

    <!-- Loading state mentre carica il layout -->
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
        <p>Caricamento...</p>
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
        background: #f8fafc;
      }

      .loading-spinner {
        text-align: center;
        color: #2563eb;
      }

      .loading-spinner svg {
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      .loading-spinner p {
        font-size: 1.1rem;
        font-weight: 500;
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
      // Carica il layout condiviso dinamicamente
      const { SharedLayoutComponent } = await loadRemoteModule(
        'shell',
        './shared-layout'
      );

      // Crea il component dinamicamente
      this.layoutComponentRef = this.viewContainerRef.createComponent(
        SharedLayoutComponent
      );
      this.isLayoutLoaded = true;
    } catch (error) {
      console.error('Errore nel caricamento del layout:', error);
      // Fallback - mostra un messaggio di errore o layout base
      this.showErrorLayout();
    }
  }

  private showErrorLayout() {
    // Crea un layout di fallback semplice
    const errorElement = document.createElement('div');
    errorElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fee2e2; color: #dc2626;">
        <div style="text-align: center;">
          <h1>Errore nel caricamento</h1>
          <p>Impossibile caricare il layout. Ricarica la pagina.</p>
          <button onclick="window.location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
            Ricarica
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(errorElement);
    this.isLayoutLoaded = true;
  }

  ngOnDestroy() {
    // Cleanup del component dinamico
    if (this.layoutComponentRef) {
      this.layoutComponentRef.destroy();
    }
  }
}
