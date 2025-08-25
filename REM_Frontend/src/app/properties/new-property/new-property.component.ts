import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-property',
  standalone: false,
  templateUrl: './new-property.component.html',
  styleUrl: './new-property.component.css',
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('card', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('180ms cubic-bezier(0.2, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ transform: 'scale(0.97)', opacity: 0 }))
      ])
    ])
  ]
})
export class NewPropertyComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<FormData>();

  form!: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      propertyType: ['LAND', Validators.required],         // LAND | RESIDENTIAL | COMMERCIAL | INDUSTRIAL
      transactionType: ['SALE', Validators.required],      // SALE | RENT
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      address: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      features: this.fb.array<string>([]),                  // chips array
      featureInput: new FormControl<string>('', { nonNullable: true }), // <— non-nullable control
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]]
    });

    // Seed placeholders to showcase behavior (optional)
    this.form.patchValue({
      propertyType: 'LAND',
      transactionType: 'SALE'
    });

    // ESC to close
    window.addEventListener('keydown', this.handleEsc);
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleEsc);
  }

  private handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.onClose();
  };

  get features(): FormArray<FormControl<string>> {
    return this.form.get('features') as FormArray<FormControl<string>>;
  }

  // add chip:
  addFeatureChip(): void {
    const val = (this.form.get('featureInput')!.value || '').trim();
    if (!val) return;
    this.features.push(new FormControl<string>(val, { nonNullable: true })); // <— key fix
    this.form.get('featureInput')!.reset('');
  }

  removeFeatureChip(i: number): void {
    this.features.removeAt(i);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    // Accumulate (allows multiple selections in separate opens)
    this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
  }

  removeFile(idx: number): void {
    this.selectedFiles.splice(idx, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // Build the JSON object exactly like your demo
    const propertyPayload = {
      title: v.title,
      propertyType: v.propertyType,         // e.g. LAND
      transactionType: v.transactionType,   // SALE or RENT
      description: v.description,
      address: v.address,
      price: Number(v.price),
      features: this.features.value as string[], // ["Water Access", ...]
      latitude: Number(v.latitude),
      longitude: Number(v.longitude)
    };

    const fd = new FormData();
    fd.append('property', JSON.stringify(propertyPayload));   // <— single JSON field

    // Attach all images under the SAME key `images`
    this.selectedFiles.forEach(file => fd.append('images', file, file.name));

    this.submitForm.emit(fd);
  }

  onClose(): void {
    this.close.emit();
  }


}
