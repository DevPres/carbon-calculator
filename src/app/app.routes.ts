import {  Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('@pages/home/').then(m => m.routes) },
  { path: 'calculator', title: 'calculator', loadChildren: () => import('@pages/calculator').then(m => m.routes)},


];


