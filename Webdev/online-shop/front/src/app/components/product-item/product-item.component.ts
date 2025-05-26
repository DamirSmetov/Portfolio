import { Component, input } from '@angular/core';
import { Product } from '../../models/product';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductslistComponent } from '../productslist/productslist.component';
import { Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product-item',
  imports: [NgFor, CommonModule, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input() product!: Product;

  hoover: boolean = false;
  @Output() imageChange = new EventEmitter<string>();
  ngOnInit() {
    console.log(this.product);
  }
  onMouseEnter() {
    this.hoover = true;
  }
  onMouseLeave() {
    this.hoover = false;
  }

  changeImage(image: string) {
    this.product.main_image = image;
  }

  defaultimage() {
    this.product.main_image = this.product.images[0];
  }
}
