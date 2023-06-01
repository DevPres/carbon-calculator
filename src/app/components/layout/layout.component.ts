import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,SidebarComponent,MatIconModule],
  template: `
    <mat-drawer-container class="layout">
      <mat-drawer mode="side" [opened]="sidebarOpen()">
        <app-sidebar [sidebarOpen]="sidebarOpen"></app-sidebar>
      </mat-drawer>
      <mat-drawer-content>
        <div class="sidebar-toggle-row">
          <mat-icon (click)="onOpenSidebar()">menu</mat-icon>
        </div>

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

        .sidebar-toggle-row {
          display: none;
        }

      }

      .mat-drawer-content {
        height: 100%;
        background-color: var(--color-accent-dark);
        padding: 16px;
        box-sizing: border-box;
      }
    }

    @media (min-width: 768px) {
      .layout .mat-drawer {
        max-width: 300px;
        width: 25%;

        .sidebar-toggle-row {
          display: none;
        }
      }
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  sidebarOpen = signal(true);

  onOpenSidebar(): void {
    this.sidebarOpen.set(true);
  }


}
