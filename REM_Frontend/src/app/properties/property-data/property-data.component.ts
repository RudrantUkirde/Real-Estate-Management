import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-property-data',
  standalone: false,
  templateUrl: './property-data.component.html',
  styleUrl: './property-data.component.css'
})
export class PropertyDataComponent {

  @Input() property: any;
   selectedImageIndex = 0;

   selectImage(idx: number) {
    this.selectedImageIndex = idx;
  }

}
