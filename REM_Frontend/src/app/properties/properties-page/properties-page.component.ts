import { Component } from '@angular/core';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../map/mapServices/property.service';
import { StorageService } from '../../user/UserService/storage.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared-component/snackbar.service';

@Component({
  selector: 'app-properties-page',
  standalone: false,
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.css'
})
export class PropertiesPageComponent {

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  search: string = '';
  filterType: string = 'All';
  sortBy: string = 'Latest';

  isNewOpen = false;
  submitting = false;

  openNewModal() { this.isNewOpen = true; }
  closeNewModal() { this.isNewOpen = false; }

  page = 0;
  size = 8;
  totalPages = 0;
  loading = false;
  allLoaded = false;
  loadingAll = false;

  constructor(private propertyService: PropertyService,private router:Router,private snackbarService:SnackbarService) {}

  ngOnInit(): void {
    this.loadProperties();
  }


  loadProperties() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    this.propertyService.getProperties(this.page, this.size).subscribe({
      next: (response) => {
        this.properties = [...this.properties, ...response.content];
        this.applyFilterAndSort();
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
    if (this.loadingAll) return;
    this.loadProperties();
  }

  trackById(index: number, item: Property) {
  return item.id;
  }

  onSearchChange() {
    this.applyAcrossAll();
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterType = value;
    this.applyAcrossAll();
  }

  onSortChange(event:Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy = value;
    this.applyAcrossAll();
  }

  applyFilterAndSort() {
    let props = [...this.properties];

    if (this.filterType !== 'All') {
      props = props.filter(p => p.propertyType === this.filterType.toUpperCase());
    }

    if (this.search) {
      const keyword = this.search.toLowerCase();
      props = props.filter(
        p =>
          p.title.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.address?.toLowerCase().includes(keyword)
      );
    }

    if (this.sortBy === 'Price: Low to High') {
      props.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'Price: High to Low') {
      props.sort((a, b) => b.price - a.price);
    }

    this.filteredProperties = props;
  }

  /**
   * Ensures all pages are loaded before applying filter/sort/search,
   * so operations run against the complete dataset instead of only visible items.
   */
  private applyAcrossAll() {
    if (this.allLoaded) {
      this.applyFilterAndSort();
      return;
    }
    this.loadAllRemainingPages(() => this.applyFilterAndSort());
  }

  /**
   * Sequentially loads all remaining pages.
   * Calls the provided callback once all pages are loaded or on error.
   */
  private loadAllRemainingPages(done?: () => void) {
    if (this.allLoaded) {
      done?.();
      return;
    }
    if (this.loadingAll) {
      // Already loading all; just apply when current load cycle completes
      return;
    }
    this.loadingAll = true;

    const loadNext = () => {
      // Prevent overlapping with any ongoing single-page load
      if (this.loading) {
        // Try again shortly; avoids race with infinite scroll fetching
        setTimeout(loadNext, 50);
        return;
      }
      this.loading = true;
      this.propertyService.getProperties(this.page, this.size).subscribe({
        next: (response) => {
          this.properties = [...this.properties, ...response.content];
          this.totalPages = response.totalPages;
          this.page++;
          this.loading = false;
          if (this.page >= this.totalPages || response.last) {
            this.allLoaded = true;
            this.loadingAll = false;
            done?.();
          } else {
            loadNext();
          }
        },
        error: () => {
          // Fail gracefully; apply on what we have
          this.loading = false;
          this.loadingAll = false;
          done?.();
        }
      });
    };

    loadNext();
  }

  onViewProperty(property: Property) {
    // Handle viewing property details (e.g., navigate to detail page)
    const token=StorageService.getToken();
    if (token) {
        this.router.navigateByUrl(`/properties/property-details/${property.id}`);
        
    }else{
        this.router.navigateByUrl("/user/signin");
        this.snackbarService.show('Please login to view properties!!','error');
        return;
    }    
  }

  handleCreateProperty(fd: FormData) {
    // Optional: gate by auth
    const token = StorageService.getToken?.();
    if (!token) {
      this.snackbarService.show('Please login to create a property', 'error');
      this.router.navigateByUrl('/user/signin');
      return;
    }

    this.submitting = true;
    this.propertyService.createProperty(fd).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.status === 201) {
          this.snackbarService.show('Property added successfully', 'success');
          this.isNewOpen = false;
          // Refresh list from first page to include the new entry
          this.page = 0;
          this.totalPages = 0;
          this.allLoaded = false;
          this.properties = [];
          this.filteredProperties = [];
          this.loadProperties();
          return;
        }
        this.snackbarService.show('Unexpected response from server.', 'error');
      },
      error: (err) => {
        this.submitting = false;
        this.snackbarService.show('Failed to create property', 'error');
        console.error(err);
      }
    });
  }

}
