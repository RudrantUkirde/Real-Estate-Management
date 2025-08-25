import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../user/UserService/user.service';
import { User } from '../../models/user.model';
import { SnackbarService } from '../../shared-component/snackbar.service';

@Component({
  selector: 'app-update-profile',
  standalone: false,
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {

  constructor(private userService: UserService,private snackbarService:SnackbarService) {}


  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @Input() user!: User | null;
  @Output() close = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<any>();

  editableUser!: User;

  ngOnInit() {
    this.editableUser = { ...this.user }; // Shallow copy
  }

  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview != e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {

    // Call your API to update the profile
    // Use your UserService for update logic
    this.userService.updateUser(this.editableUser.id!,this.editableUser,this.selectedFile!).subscribe({

      next:(res)=>{
        this.profileUpdated.emit(res);
        this.close.emit();
        this.snackbarService.show('Update successful!!','success');
      },
      error:(err)=>{
        console.log(err);
        if(err.status===404){
          this.snackbarService.show('User Not Found!!','error');
        }else if(err.status===400){
          this.snackbarService.show('Profile update failed','error');
        }
        this.close.emit();
      }
    });
  }

  onCancel() {
    this.close.emit();
  }

}
