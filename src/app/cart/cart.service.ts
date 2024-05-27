import { Injectable } from '@angular/core';
import { Cart } from './cart';
import { CartItems } from './cart-items';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartChanged=new Subject<Cart>();
  private cart:Cart;
  constructor() { }
  getCart(){
    return this.cart;
  }
  setCart(cart:Cart)
  {
    this.cart=cart;
    this.cartChanged.next(this.cart);
  }
  addItem(item:CartItems){
    item.quantity=1;
    this.cart.cartItems.push(item);
    this.cart.total+=item.total;
    this.cartChanged.next(this.cart);
  }
  addItemwithQuantity(item:CartItems,quantity:number)
  {
    item.quantity=quantity;
    this.cart.cartItems.push(item);
    this.cart.total+=item.total;
    this.cartChanged.next(this.cart);
  }
}
