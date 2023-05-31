import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headerbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderbarComponent {

}
