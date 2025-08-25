import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mortgage-calculator',
  standalone: false,
  templateUrl: './mortgage-calculator.component.html',
  styleUrl: './mortgage-calculator.component.css'
})
export class MortgageCalculatorComponent {

  @Input() price: number = 0;
  downPayment: number = 0;
  rate: number = 7.5; // annual rate in percent
  term: number = 20; // years

  monthlyPayment: number = 0;

  ngOnInit() {
    this.calculateMonthlyPayment();
  }

  calculateMonthlyPayment(): void {
    const P = (this.price || 0) - (this.downPayment || 0);
    const n = (this.term || 0) * 12;
    const r = (this.rate || 0) / 1200;

    if (P > 0 && r > 0 && n > 0) {
      this.monthlyPayment = (P * r) / (1 - Math.pow(1 + r, -n));
    } else {
      this.monthlyPayment = 0;
    }
  }

}
