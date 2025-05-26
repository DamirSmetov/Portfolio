import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { ProductsService } from '../../products.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerData: User = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  };

  errorMessage: string = '';

  constructor(private api: ProductsService, private router: Router) {}

  onRegister() {
    this.api.adduser(this.registerData).subscribe(
      (response) => {
        alert('User registered successfully!');
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
