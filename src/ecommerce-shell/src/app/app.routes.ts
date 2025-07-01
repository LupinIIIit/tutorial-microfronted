import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      loadRemoteModule('products', './component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      loadRemoteModule('cart', './component').then((m) => m.CartComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      loadRemoteModule('profile', './component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      loadRemoteModule('profile', './login').then((m) => m.LoginComponent),
  },
];
