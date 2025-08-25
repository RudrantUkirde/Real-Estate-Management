import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

const BASE_URL= environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }


  //signup service method
  signup(signupRequest:any):Observable<any>{

    return this.http.post(BASE_URL + "auth/signup",signupRequest);

  }

  //login service method
  login(loginRequest:any):Observable<any>{

    return this.http.post(BASE_URL + "auth/login",loginRequest);

  }

  //Verify User API
  verifyUser(verifyRequest:any): Observable<any> {

    return this.http.post(BASE_URL + "auth/verify", verifyRequest);

  }

  //Resend Verification API call
  resendCode(email:string):Observable<any>{

    const params = new HttpParams().set('email',email);

    return this.http.post(BASE_URL + "auth/resendCode",null,{params});
    
  }

  //Get User API Call
  getUserById(userId:string | null):Observable<any>{

    return this.http.get(`${BASE_URL}user/profile/${userId}`);

  }

  //Update User API
  updateUser(userId: number,user: User, profileImageFile?: File):Observable<any>{

      const formData=new FormData();

      // Only include fields that the backend expects in the DTO
      const userUpdateDTO = {
        username: user.username,
        email: user.email,
        contactNumber: user.contactNumber,
      };

      formData.append('user',JSON.stringify(userUpdateDTO));

      // Only add the image if there is one
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      console.log(formData.get('user'));
      console.log(formData.get('profileImage'));
      return this.http.put(BASE_URL+`user/update/${userId}`,formData);

  }
}
