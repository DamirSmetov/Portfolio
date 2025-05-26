import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { User } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseurl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.baseurl);
  }

  getProductsbyCategory(categoryId: number): Observable<any> {
    return this.http.get(
      this.baseurl + 'categories/' + categoryId + '/products/'
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(this.baseurl + 'products/' + id + '/');
  }

  adduser(user: User): Observable<User> {
    return this.http.post<User>(this.baseurl + 'register_user/', user);
  }
}
