import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
];

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
