import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
activeIndex: number | null = null;

  items = [
    { title: 'Country', content: 'Country details...' },
    { title: 'Community', content: 'Community details...' },
    { title: 'A third item', content: 'Third item details...' },
    { title: 'A fourth item', content: 'Fourth item details...' },
    { title: 'And a fifth one', content: 'Fifth item details...' },
  ];

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
