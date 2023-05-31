import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,SidebarComponent],
  template: `
    <mat-drawer-container class="layout">
      <mat-drawer mode="side" opened>
        <app-sidebar></app-sidebar>
      </mat-drawer>
      <mat-drawer-content>
        <ng-content></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .layout {
      width: 100vw;
      height: 100vh;

      .mat-drawer {
        width: 100%;
        background-color: var(--color-accent-light);
        border-right: 1px solid var(--color-primary);
      }

      .mat-drawer-content {
        background-color: transparent;
      }
    }

    @media (min-width: 600px) {
      .layout .mat-drawer {
        max-width: 300px;
        width: 25%;
      }
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {}
