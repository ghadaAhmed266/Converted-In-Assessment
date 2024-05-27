import { Component , OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductsService } from '../products.service';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../../cart/cart.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  quantity:number=0;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
    });
    }

  addToCart(product: Product): void {
    this.productService.addToCart(product);
  }
}