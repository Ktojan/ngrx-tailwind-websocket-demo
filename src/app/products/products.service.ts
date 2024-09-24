import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsAPIUrl = 'api/products';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<Product[]>(this.productsAPIUrl)
      .pipe(
        tap(res => console.log(res)),
        retry(1),
        catchError(this.handleError),
      );
  }

  getById(id: number) {
    return this.http
      .get<Product>(`${this.productsAPIUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  update(product: Product): Observable<Product> {
    return this.http
      .put<Product>(this.productsAPIUrl, product)
      .pipe(catchError(this.handleError));
  }

  add({ name, price }: Product): Observable<Product> {
    return this.http
      .post<Product>(this.productsAPIUrl, { name, price })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<unknown> {
    const url = `${this.productsAPIUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError({ status }: HttpErrorResponse) {
    return throwError(
      () => `${status}: Something bad happened.`
    );
  }  
}

export const sumProducts = (products: Product[]) =>
  products.reduce((acc: number, cur) => acc + cur.price, 0);
