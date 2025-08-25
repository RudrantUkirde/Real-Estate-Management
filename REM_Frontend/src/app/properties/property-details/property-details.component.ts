import { Component } from '@angular/core';
import { PropertyService } from '../../map/mapServices/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { StorageService } from '../../user/UserService/storage.service';

@Component({
  selector: 'app-property-details',
  standalone: false,
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent {

  property: any = null;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private router:Router,
    private snackbarService:SnackbarService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    // this.propertyService.getPropertyById(id).subscribe(data => {
    //   this.property = data;
    // });
    this.propertyService.getPropertyById(id).subscribe({
      next:(data)=>{
        this.property=data;
      },
      error:(err)=>{
        console.log(err);
        if(err.status===403){
          this.router.navigateByUrl("/user/signin");
          this.snackbarService.show('Session expired, Please login again...','error');
          StorageService.logout();
        }

      }
    })
  }
  goBack() {
  window.history.back();
  }

}
