import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ConvertedIn-Assessment';
  constructor( private productsrv:ProductsService)
  {}
  ngOnInit(): void {
    }
}
