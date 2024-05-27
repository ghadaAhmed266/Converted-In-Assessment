// src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  totalProducts = 0;
  currentPage = 1;
  pageSize = 20;
  selectedCategory = 'All';
  selectedBrands: string[] = [];
  minPrice = 0;
  maxPrice = 100;
  minRating = 0;
  maxRating = 5;
  pageCount=0;
  pagesNumbers=[1];
  selectAllChecked: boolean = false;
  categories: string[] = ['All'];
  brands: string[] = [];
  sliderValue: number = 50; // Initial slider value
  searchQuery: string = '';
  private subscription: Subscription;
  

  constructor(private productService: ProductsService) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    this.subscription = this.productService.callSearch$.subscribe((data: any) => {
      this.onSearchQueryChange(data);
    });
  }
  
  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.totalProducts = products.length;
       let x=0;
      for(let i=0;i<this.products.length;i++)
        if (this.products[i].price > x)
          x=this.products[i].price ;
        this.maxPrice=x;
      this.filterProducts();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = ['All', ...categories];
    });
  }

  loadBrands() {
    this.productService.getBrands().subscribe(brands => {
      this.brands = [ ...brands];
    });
  }
  
  filterProducts() {
    let filteredProducts = this.products;
    if (this.selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === this.selectedCategory);
    }
    if (this.selectedBrands && this.selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter(product => this.selectedBrands.includes(product.brand));
    }
    if (this.searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(this.searchQuery) ||
        product.description.toLowerCase().includes(this.searchQuery)
      );
    }
    filteredProducts = this.productService.filterByPrice(filteredProducts, this.minPrice, this.maxPrice);
    filteredProducts = this.productService.filterByRating(filteredProducts, this.minRating,this.maxRating);

    this.totalProducts = filteredProducts.length;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedProducts = filteredProducts.slice(start, end);
    this.pagesNumbers=[1];
    this.pageCount=Math.ceil(this.totalProducts/this.pageSize);
      let divider=1;
      if(this.pageCount%2===0)
        divider=this.pageCount;
      else
        divider=this.pageCount-1;
      for(let x=1;x<divider/4;x++)
      {
        this.pagesNumbers.push(x+1);
      }
      this.pagesNumbers.push(0);
      for(let x=divider/4*3+1;x<=this.pageCount;x++)
        {
          if(x===this.pageCount)
            this.pagesNumbers.push(x);
          else
            this.pagesNumbers.push(x+1);
        }
  }
  onSearchQueryChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    this.filterProducts();
  }
  onPageChange(page: number) {
    if(page===0)page=this.pageSize/2;
    if (page < 1 || page > this.pageCount) return;
    this.currentPage = page;
    this.filterProducts();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page when category changes
    this.filterProducts();
  }
  onBrandChange(brand: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedBrands.push(brand);
    } else {
      const index = this.selectedBrands.indexOf(brand);
      if (index > -1) {
        this.selectedBrands.splice(index, 1);
      }
      this.selectAllChecked = false; // Uncheck "Select All" if any checkbox is unchecked
    }
    this.currentPage = 1; // Reset to first page when brand changes
    this.filterProducts();
  }
  onSelectAllChange(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedBrands = [...this.brands]; // Select all brands
    } else {
      this.selectedBrands = []; // Deselect all brands
    }
    this.selectAllChecked = isChecked;
    this.filterProducts();
  }
  onPriceRangeChange() {
    this.filterProducts();
  }
  onSliderChangeStart(event: any): void {
    this.minRating = event.value;
    this.filterProducts();
  }
  onSliderChangeEnd(event: any): void {
    this.maxRating = event;
    
    this.filterProducts();
  }
  onRatingChange() {
    this.filterProducts();
  }
}
