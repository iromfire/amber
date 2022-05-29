import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../shared/product.service';
import { OrderService } from '../shared/order.service';
import { NotifierService } from '../shared/notifier.service';
import { Product } from '../shared/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  totalPrice: Observable<number> = this.productServ.totalPrice;
  cartProducts: Observable<Product[]> = this.productServ.products.pipe(
    map((products) => products.filter((p) => p.isCart))
  );

  constructor(
    private productServ: ProductService,
    private orderServ: OrderService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      adress: new FormControl(null, Validators.required),
      payment: new FormControl('Наличные'),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const sub = this.totalPrice.subscribe((price) => {
      const order = {
        name: this.form.value.name,
        phone: this.form.value.phone,
        adress: this.form.value.adress,
        orders: this.productServ.productsState.filter((p) => p.isCart),
        payment: this.form.value.payment,
        price,
        date: new Date(),
      };
      this.orderServ.create(order).subscribe(() => {
        this.form.reset();
        this.submitted = false;
      });
      this.notifierService.showNotification(
        `Ваш заказ на сумму $${price} был оформлен`,
        'ОК'
      );
      sub.unsubscribe();
    })
  }
}
