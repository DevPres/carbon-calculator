import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    class: 'sidebar-content'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {}
