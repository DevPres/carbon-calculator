import {  Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'new-estimate', title: 'estimate', loadComponent: () => import('@pages/estimates/estimates.component').then(m => m.EstimatesComponent)},
  { path: ':id', title: 'estimate', loadComponent: () => import('@pages/estimates/estimates.component').then(m => m.EstimatesComponent)},
  { path: '', redirectTo: 'new-estimate', pathMatch: 'full' },
];

