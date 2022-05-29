import { Component, OnInit } from '@angular/core';
import { Order } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { OrderService } from '../../shared/order.service';
import { CheckDialogComponent } from '../../shared/dialogs/check-dialog/check-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  orders: Array<Order> = [];
  pSub?: Subscription;
  rSub?: Subscription;
  productName!: string;
  constructor(private orderServ: OrderService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pSub = this.orderServ.getAll().subscribe((orders) => {
      this.orders = orders;
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.rSub) {
      this.rSub.unsubscribe();
    }
  }

  remove(id: any): void {
    let dialog = this.dialog.open(CheckDialogComponent);
    dialog.afterClosed().subscribe((result) => {
      if (result == 'Да') {
        this.rSub = this.orderServ.remove(id).subscribe(() => {
          this.orders = this.orders.filter((orders) => orders.id != id);
        });
      }
    });
  }
}
