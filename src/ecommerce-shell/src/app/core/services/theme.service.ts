import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'corporate';

@Injectable({
  providedIn: 'root',
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
      '--bg-tertiary': '#f1f5f9',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--border-color': '#e2e8f0',
      '--border-hover': '#cbd5e1',
      '--primary-color': '#2563eb',
      '--primary-hover': '#1d4ed8',
      '--success-color': '#10b981',
      '--danger-color': '#ef4444',
      '--warning-color': '#f59e0b',
    },
    dark: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--bg-tertiary': '#334155',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#cbd5e1',
      '--text-muted': '#64748b',
      '--border-color': '#334155',
      '--border-hover': '#475569',
      '--primary-color': '#3b82f6',
      '--primary-hover': '#2563eb',
      '--success-color': '#10b981',
      '--danger-color': '#ef4444',
      '--warning-color': '#f59e0b',
    },
    corporate: {
      '--bg-primary': '#fefefe',
      '--bg-secondary': '#f5f7fa',
      '--bg-tertiary': '#edf2f7',
      '--text-primary': '#2d3748',
      '--text-secondary': '#4a5568',
      '--text-muted': '#718096',
      '--border-color': '#e2e8f0',
      '--border-hover': '#cbd5e1',
      '--primary-color': '#805ad5',
      '--primary-hover': '#6b46c1',
      '--success-color': '#38a169',
      '--danger-color': '#e53e3e',
      '--warning-color': '#d69e2e',
    },
  };

  constructor() {
    this.loadSavedTheme();
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    const themeVars = this.themes[theme];

    // Applica le variabili CSS
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Imposta l'attributo data-theme
    root.setAttribute('data-theme', theme);
  }

  private saveTheme(theme: Theme) {
    localStorage.setItem('app-theme', theme);
  }

  private loadSavedTheme() {
    const saved = localStorage.getItem('app-theme') as Theme;
    if (saved && ['light', 'dark', 'corporate'].includes(saved)) {
      this.setTheme(saved);
    }
  }

  getCurrentThemeVars(): Record<string, string> {
    return this.themes[this.currentTheme()];
  }
}
