import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Property } from '../../models/property.model';
import { StorageService } from '../../user/UserService/storage.service';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-properties',
  standalone: false,
  templateUrl: './list-properties.component.html',
  styleUrl: './list-properties.component.css'
})
export class ListPropertiesComponent {

  @Input() properties: Property[] = [];
  @Output() viewProperty = new EventEmitter<Property>();
  @Output() newProperty = new EventEmitter<void>();

  constructor(private snackbarService:SnackbarService,private router:Router){}

  onView(property: Property) {
    this.viewProperty.emit(property);
  }
  onNewPropertyClick() {

    const token = StorageService.getToken?.();
    if (!token) {
      this.snackbarService.show('Please login to create a property', 'error');
      this.router.navigateByUrl('/user/signin');
      return;
    }
    this.newProperty.emit(); 
  }

}
