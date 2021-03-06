import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FbOrdersResponse, FbResponse, Order } from './interfaces';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  create(order: Order): Observable<Order> {
    return this.http
      .post<FbResponse>(`${environment.fbDbUrl}/orders.json`, order)
      .pipe(
        map((res) => {
          return {
            ...order,
            id: res.name,
            date: new Date(order.date),
          };
        })
      );
  }

  getAll(): Observable<Order[]> {
    return this.http
      .get<FbOrdersResponse>(`${environment.fbDbUrl}/orders.json`)
      .pipe(
        map((res) => {
          return Object.keys(res).map(
            (key) =>
              ({
                ...res[key],
                id: key,
                date: new Date(res[key].date),
              } as Order)
          );
        })
      );
  }

  remove(id: string | number) {
    return this.http.delete(`${environment.fbDbUrl}/orders/${id}.json`);
  }
}
