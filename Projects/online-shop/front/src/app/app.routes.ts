import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VolleyballComponent } from './components/volleyball/volleyball.component';
import { ProductslistComponent } from './components/productslist/productslist.component';
import { ProductItemPageComponent } from './components/product-item-page/product-item-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home' },
  { path: 'register', component: RegisterComponent, title: 'register' },
  { path: 'login', component: LoginComponent, title: 'login' },
  { path: ':category', component: ProductslistComponent, title: 'category' },
  {
    path: ':category/:product',
    component: ProductItemPageComponent,
    title: 'product',
  },
];
