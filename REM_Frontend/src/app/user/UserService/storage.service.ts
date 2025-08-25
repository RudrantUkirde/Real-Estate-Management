import { Injectable } from '@angular/core';

const TOKEN="token";
const USER="user";
const THEME="theme";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static getTheme(): string{
    return localStorage.getItem(THEME) || '';
  }

  static setTheme(theme:string):void{
    window.localStorage.removeItem(THEME);
    window.localStorage.setItem(THEME,theme);
  }

  static saveToken(token:string) :void{

    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN,token);

  }

  static saveUser(user:any) :void{

    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER,JSON.stringify(user));

  }

  static getToken(): string{

    return localStorage.getItem(TOKEN) || "";

  }

  static getUser(): any{
  
    // return JSON.parse(localStorage.getItem(USER));
    const userData = localStorage.getItem(USER);
    return userData ? JSON.parse(userData) : null;

  }

  static getUserRole(): string{

    const user = this.getUser();
    if(user == null){
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }
    const role: string = (this.getUserRole() || '').toUpperCase();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  static isUserLoggedIn(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }
    const role: string = (this.getUserRole() || '').toUpperCase();
    return role === 'USER' || role === 'ROLE_USER';
  }

  static getUserId(): string{
    const user=this.getUser();
    if(user == null){
      return "";
    }
    return user.id;
  }

  static logout(): void{

    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
