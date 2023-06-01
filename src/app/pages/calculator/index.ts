import {  Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'new-estimate', title: 'calculator', loadComponent: () => import('@pages/calculator/calculator.component').then(m => m.CalculatorComponent)},
  { path: ':id', title: 'calculator', loadComponent: () => import('@pages/calculator/calculator.component').then(m => m.CalculatorComponent)},
  { path: '', redirectTo: 'new-estimate', pathMatch: 'full' },

];

