import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/UserService/user.service';
import { SnackbarService } from '../../shared-component/snackbar.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
editProfile() {
throw new Error('Method not implemented.');
}

  user: User | null =null;

  showEditModal=false;

  constructor(private route:ActivatedRoute,private userService:UserService,private snackbarService:SnackbarService){}

  ngOnInit():void{

    const userId=this.route.snapshot.paramMap.get('userId');
    // this.getUserData(userId);
    this.userService.getUserById(userId).subscribe({
      next:(data)=>{
        this.user=data;
        console.log(this.user);
      },
      error:(err)=>{
        console.log(err);
        this.snackbarService.show('Failed to fetch user data..','error');
      }
    });
    
  }

    openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  onProfileUpdated(updatedUser: User) {
    this.user = updatedUser;
  }

  // getUserData(userId:string | null){

  //   this.userService.getUserById(userId).subscribe({
  //     next:(data)=>{
  //       this.user=data;
  //       console.log(this.user);
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //       this.snackbarService.show('Failed to fetch user data..','error');
  //     }
  //   })
  // }

}
