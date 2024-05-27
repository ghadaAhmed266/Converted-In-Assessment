import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.model';
import {  Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://dummyjson.com/products';
  private cacheKey = 'products';
  private cacheTTL = 15 * 60 * 1000; // 15 minutes

  
  private searchSource = new Subject<void>();
  private cart: Product[] = [];

  constructor(private http: HttpClient) {}
  callSearch$ = this.searchSource.asObservable();

  triggerSearch(data:any) {
    this.searchSource.next(data);
  }
  getProductById(id: number): Observable<Product | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      map(data => data as Product));
  }

  getProducts(): Observable<Product[]> {
    const cachedData = this.getFromCache();
    if (cachedData) {
      return of(cachedData);
    } else {
      return this.http.get<any>(`${this.apiUrl}?limit=100`).pipe(
        map(data => data.products as Product[]),
        map(products => {
          this.saveToCache(products);
          return products;
        })
      );
    }
  }

  private getFromCache(): Product[] | null {
    const cached = localStorage.getItem(this.cacheKey);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < this.cacheTTL) {
      return parsed.data;
    } else {
      localStorage.removeItem(this.cacheKey);
      return null;
    }
  }

  private saveToCache(products: Product[]): void {
    const data = {
      timestamp: Date.now(),
      data: products
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(data));
  }
  getCategories(): Observable<string[]> {
    return this.getProducts().pipe(
      map(products => {
        const categoriesSet = new Set<string>();
        products.forEach(product => {
          categoriesSet.add(product.category);
        });
        return Array.from(categoriesSet);
      })
    );
  }

  getBrands(): Observable<string[]> {
    return this.getProducts().pipe(
      map(products => {
        const brandsSet = new Set<string>();
        products.forEach(product => {
          brandsSet.add(product.brand);
        });
        return Array.from(brandsSet);
      })
    );
  }
  filterByPrice(products: Product[], minPrice: number, maxPrice: number): Product[] {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  filterByRating(products: Product[], minRating: number,maxRating:number): Product[] {
    return products.filter(product => product.rating >= minRating && product.rating <= maxRating);
  }
  addToCart(product: Product): void {
    this.cart.push(product);
  }

  getCart(): Product[] {
    return this.cart;
  }

  removeFromCart(productId: number): void {
    const index = this.cart.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
  }
}

/*import { Injectable, OnDestroy, OnInit } from '@angular/core';
import{ Product} from './product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'https://dummyjson.com/products';
  private searchSource = new Subject<void>();
  private cacheKey = 'products';
  private cacheTTL = 15 * 60 * 1000; // 15 minutes

  private cart: Product[] = [];

  constructor(private http: HttpClient) { }
  callSearch$ = this.searchSource.asObservable();

  triggerSearch(data:any) {
    this.searchSource.next(data);
  }
  getProductById(id: number): Observable<Product | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      map(data => data as Product));
  }
  handleError<T>(arg0: string): (err: any, caught: Observable<Product>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl+'?limit=100').pipe(
      map(data => data.products as Product[])
    );
  }
  getCategories(): Observable<string[]> {
    return this.getProducts().pipe(
      map(products => {
        const categoriesSet = new Set<string>();
        products.forEach(product => {
          categoriesSet.add(product.category);
        });
        return Array.from(categoriesSet);
      })
    );
  }

  getBrands(): Observable<string[]> {
    return this.getProducts().pipe(
      map(products => {
        const brandsSet = new Set<string>();
        products.forEach(product => {
          brandsSet.add(product.brand);
        });
        return Array.from(brandsSet);
      })
    );
  }
  filterByPrice(products: Product[], minPrice: number, maxPrice: number): Product[] {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  filterByRating(products: Product[], minRating: number,maxRating:number): Product[] {
    return products.filter(product => product.rating >= minRating && product.rating <= maxRating);
  }
  addToCart(product: Product): void {
    this.cart.push(product);
  }

  getCart(): Product[] {
    return this.cart;
  }

  removeFromCart(productId: number): void {
    const index = this.cart.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
  }
}
   */