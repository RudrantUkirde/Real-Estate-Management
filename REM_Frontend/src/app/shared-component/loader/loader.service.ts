import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private buttonLoading = new BehaviorSubject<boolean>(false);
  isButtonLoading = this.buttonLoading.asObservable();

  showButtonLoader() {
    this.buttonLoading.next(true);
  }

  hideButtonLoader() {
    this.buttonLoading.next(false);
  }
}
