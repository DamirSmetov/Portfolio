import { AuthService } from './../../auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { ProductsService } from '../../products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';
import { first } from 'rxjs';
import { EmitterService } from '../emmiters';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  registerData = {
    email: '',
    password: '',
  };
  errorMessage: string = '';

  user_data: User = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  };
  islogged: boolean = false;

  baseurl = 'http://127.0.0.1:8000/api/login_user/';
  constructor(
    private api: ProductsService,
    private route: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  onLogin() {
    this.http
      .post<any>(this.baseurl, this.registerData, { withCredentials: true })
      .subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem('token', token);
          alert('User logged in successfully!');
          console.log('User logged in successfully:', response);
          this.http
            .get<User>('http://127.0.0.1:8000/api/get_user/', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .subscribe((data) => {
              this.user_data = data;
              this.islogged = true;
              EmitterService.authemitter.emit(this.user_data);
              this.route.navigate(['/']);
            });
        },
        (error) => {
          console.error('Error logging in user:', error);
          this.errorMessage = 'Login failed. Please try again.';
        }
      );
  }
}
