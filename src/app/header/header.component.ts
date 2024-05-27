import { Component, OnInit } from '@angular/core';
import { Product } from '../products/product.model';
import { ProductsService } from '../products/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  poducts:Product[];
  categories: string[] = ['All'];
  cart: Product[] = [];
  constructor(private prodsrv:ProductsService){
  }
  ngOnInit(): void {
    
    this.prodsrv.getCategories().subscribe(categories => {
      this.categories = ['All', ...categories];
    });
    this.cart = this.prodsrv.getCart();
  }

  removeFromCart(productId: number): void {
    this.prodsrv.removeFromCart(productId);
    this.cart = this.prodsrv.getCart();
  }
  onSearchQueryChange(event: any) {
    this.prodsrv.triggerSearch(event);
  }
  
}
