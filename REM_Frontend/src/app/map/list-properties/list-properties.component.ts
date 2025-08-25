import { Component, OnInit } from '@angular/core';
import { Property } from '../../models/property.model';
import { PropertyService } from '../mapServices/property.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { StorageService } from '../../user/UserService/storage.service';

@Component({
  selector: 'app-list-properties',
  standalone: false,
  templateUrl: './list-properties.component.html',
  styleUrl: './list-properties.component.css'
})
export class ListPropertiesComponent implements OnInit {

  properties: Property[] = [];
  page = 0;
  size = 8;
  totalPages = 0;
  loading = false;
  allLoaded = false;

  constructor(private propertyService: PropertyService,
              private router:Router,
              private snackbarService:SnackbarService
  ) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.propertyService.getProperties(this.page, this.size).subscribe({
      next: (response) => {
        this.properties = [...this.properties, ...response.content];
        this.totalPages = response.totalPages;
        this.page++;
        if (this.page >= this.totalPages || response.last) {
          this.allLoaded = true;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onScroll() {
    this.loadProperties();
  }

  trackById(index: number, item: Property) {
  return item.id;
  }

  onViewProperty(propertyId: number) {
    const token=StorageService.getToken();
    if (token) {
      this.router.navigateByUrl(`/properties/property-details/${propertyId}`);
    }else{
      this.router.navigateByUrl("/user/signin");
      this.snackbarService.show('Please login to view properties!!','error');
      return;
    }
  }

}
