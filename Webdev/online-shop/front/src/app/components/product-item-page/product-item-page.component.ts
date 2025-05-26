import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../products.service';
import { Product } from '../../models/product';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { QueryList } from '@angular/core';
import { ViewChildren } from '@angular/core';

@Component({
  selector: 'app-product-item-page',
  imports: [CommonModule, NgFor, RouterLink, NgIf],
  templateUrl: './product-item-page.component.html',
  styleUrl: './product-item-page.component.css',
})
export class ProductItemPageComponent {
  @ViewChildren('zoomBox') zoomBoxes!: QueryList<ElementRef<HTMLDivElement>>;

  zoomImage(event: MouseEvent, index: number): void {
    const zoomBox = this.zoomBoxes.toArray()[index].nativeElement;
    const rect = zoomBox.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    zoomBox.style.backgroundPosition = `${x}% ${y}%`;
  }

  resetZoom(index: number): void {
    const zoomBox = this.zoomBoxes.toArray()[index].nativeElement;
    setTimeout(() => {
      zoomBox.style.backgroundPosition = 'center';
    }, 200);
  }

  constructor(private route: ActivatedRoute, private api: ProductsService) {}

  recomendations: Product[] = [];
  product_selected: Product = null!;
  product_id: number = 0;
  loaded: boolean = false;

  categories = [
    { name: 'Football', id: 1 },
    { name: 'Golf', id: 2 },
    { name: 'Volleyball', id: 3 },
    { name: 'Basketball', id: 4 },
  ];
  selected_category_id: any = 0;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.product_id = params['id'];
      console.log(this.product_id);
      this.loadProduct(this.product_id);
    });
    this.route.params.subscribe((params) => {
      console.log(params['category']);
      this.selected_category_id = this.categories.find(
        (category) => category.name === params['category']
      )?.id;
      console.log(this.selected_category_id);
      console.log(this.product_id);

      this.api
        .getProductsbyCategory(this.selected_category_id)
        .subscribe((data) => {
          this.recomendations = data;
          this.recomendations = this.recomendations.filter(
            (product) => product.id != this.product_id
          );
          console.log(this.recomendations);
        });
    });
  }

  loadProduct(id: number): void {
    this.api.getProductById(id).subscribe((data) => {
      this.product_selected = data;
      console.log(this.product_selected);
      this.loaded = true;
    });
  }

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: -220,
      behavior: 'smooth',
    });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: 220,
      behavior: 'smooth',
    });
  }

  hoover: boolean = false;

  on() {
    this.hoover = true;
  }
  out() {
    this.hoover = false;
  }
}
