import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface SnackData{
  message: string;
  type: 'success' | 'error' | 'info';
}


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor() { }

  /** Holds the latest snack to display.  
   *  `null` → nothing should be shown.  */
  private snackSubject = new BehaviorSubject<SnackData | null>(null);

  /** Components subscribe to this observable to show / hide the snackbar */
  readonly snack$ = this.snackSubject.asObservable();

  /** Call anywhere to trigger a snackbar */
  show(message: string, type: SnackData['type'] = 'info') {
    this.snackSubject.next({ message, type });
    // Auto‑clear after 3 s so re‑navigation doesn’t replay it:
    setTimeout(() => this.snackSubject.next(null), 3000);
  }

}
