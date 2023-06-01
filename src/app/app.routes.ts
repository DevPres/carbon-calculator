import {  Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('@pages/home/').then(m => m.routes) },
  { path: 'estimates', loadChildren: () => import('@pages/estimates').then(m => m.routes)},


];


