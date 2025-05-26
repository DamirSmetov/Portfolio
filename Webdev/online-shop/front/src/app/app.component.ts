import { AuthService } from './auth.service';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { RouterLink } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VolleyballComponent } from './components/volleyball/volleyball.component';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    HomeComponent,
    VolleyballComponent,
    RouterLinkActive,
    ProductItemComponent,
    NavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'adidas-clone';

  categories = [
    { name: 'Football', id: 1 },
    { name: 'Golf', id: 2 },
    { name: 'Volleyball', id: 3 },
    { name: 'Basketball', id: 4 },
  ];

  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ) {}
  obj: any;

  message: string = 'Please log in';
  islogged: boolean = false;
  user: User | null = null;
  ngOnInit() {
    this.loaduser();
  }

  logout() {
    this.authService.clearUser();
    localStorage.removeItem('token');
  }

  loaduser() {
    this.authService.user$.subscribe((u) => (this.user = u));
    console.log(this.user);
  }
}
