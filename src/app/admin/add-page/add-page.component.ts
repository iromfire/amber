import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/product.service';
import { NotifierService } from '../../shared/notifier.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent implements OnInit {
  form!: FormGroup;
  photo!: string;

  submitted = false;
  photoLoaded = false;

  constructor(
    private productServ: ProductService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      photo: new FormControl(),
      info: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });
  }

  processFile($event: any): void {
    const file: File = $event.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.photo = event.target.result;
      this.photoLoaded = true;
    });
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    if (!this.photo) {
      this.notifierService.showNotification('Выберите фото', 'Ок');
      return;
    }
    this.submitted = true;
    const product = {
      type: this.form.value.type,
      title: this.form.value.title,
      photo: this.photo,
      info: this.form.value.info,
      price: this.form.value.price,
      date: new Date(),
    };
    this.productServ.create(product).subscribe(() => {
      this.form.reset();
      this.photo = '';
      this.submitted = false;
      this.notifierService.showNotification('Товар успешно добавлен', 'Ок');
    });
  }
}
