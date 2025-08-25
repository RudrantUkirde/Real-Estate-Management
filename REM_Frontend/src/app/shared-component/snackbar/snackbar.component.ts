import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SnackbarService } from '../snackbar.service';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';


@Component({
  selector: 'app-snackbar',
  standalone: false,
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
  animations: [
    trigger('snackAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ]
})
export class SnackbarComponent {

  constructor(public snackbarService:SnackbarService){}

}
