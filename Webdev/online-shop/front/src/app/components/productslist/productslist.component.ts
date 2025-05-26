import { AppComponent } from './../../app.component';
import { ActivatedRoute } from '@angular/router';
import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { ProductsService } from '../../products.service';
import { HttpClient } from '@angular/common/http';
import { ProductItemComponent } from '../product-item/product-item.component';
import { Product } from '../../models/product';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { NgFor } from '@angular/common';
import { NgModel } from '@angular/forms';
import { FilterPipe } from '../../filter.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user';

//*ngFor="let product of products"

@Component({
  selector: 'app-productslist',
  imports: [NgFor, ProductItemComponent, FilterPipe, FormsModule],
  templateUrl: './productslist.component.html',
  styleUrl: './productslist.component.css',
})
export class ProductslistComponent {
  constructor(
    private route: ActivatedRoute,
    private api: ProductsService,
    private authService: AuthService
  ) {}
  categories = [
    { name: 'Football', id: 1 },
    { name: 'Golf', id: 2 },
    { name: 'Volleyball', id: 3 },
    { name: 'Basketball', id: 4 },
  ];

  loaded: boolean = false;
  category: string = '';
  searchText: string = '';
  user: User | null = null;

  @Input() products: Product[] = [];

  selected_category_id: any = 0;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params['category']);
      this.category = params['category'];
      this.selected_category_id = this.categories.find(
        (category) => category.name === params['category']
      )?.id;
      console.log(this.selected_category_id);
      this.loadProducts(this.selected_category_id);
      this.authService.user$.subscribe((u) => (this.user = u));
      console.log(this.user);
    });
  }

  loadProducts(category_id: number): void {
    this.api.getProductsbyCategory(category_id).subscribe((data) => {
      this.products = data;
      console.log(this.products);
      this.loaded = true;
    });
  }
  onSortChange(event: any) {
    if (event.target.value == 'default') {
      this.loadProducts(this.selected_category_id);
    } else if (event.target.value == 'priceAsc') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (event.target.value == 'priceDesc') {
      this.products.sort((a, b) => b.price - a.price);
    }
  }
  isScrolled = false;
  scrollTimeout: any = null;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.scrollTimeout) {
      return;
    }

    this.scrollTimeout = setTimeout(() => {
      const offset = window.scrollY || document.documentElement.scrollTop || 0;
      this.isScrolled = offset > 50;
      this.scrollTimeout = null;
    }, 100);
  }
}
