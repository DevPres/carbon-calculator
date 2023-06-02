import {  Routes } from '@angular/router';
import { estimateFeature } from '@pages/estimates/estimate.store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as EstimateFeatureEffects from '@pages/estimates/estimate.effect';
import { EstimatesApiService } from '@pages/estimates/estimates.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('@pages/home/').then(m => m.routes) },
  {
    path: 'estimates',
    providers: [
      EstimatesApiService,
      provideState('estimate', estimateFeature.reducer),
      // alternative to `EffectsModule.forFeature`
      provideEffects([EstimateFeatureEffects])
    ],
    loadChildren: () => import('@pages/estimates').then(m => m.routes)
  },


];


