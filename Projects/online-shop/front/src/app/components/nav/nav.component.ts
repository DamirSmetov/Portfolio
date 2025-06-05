import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { User } from '../../models/user';
import {
  ActivatedRoute,
  Router,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { RouterLink } from '@angular/router';
import { EmitterService } from '../emmiters';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  categories = [
    { name: 'Football', id: 1 },
    { name: 'Golf', id: 2 },
    { name: 'Volleyball', id: 3 },
    { name: 'Basketball', id: 4 },
  ];

  constructor(
    private route: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  user: User | null = null;
  message: string = 'Please log in';
  islogged: boolean = false;
  ngOnInit() {
    EmitterService.authemitter.subscribe((user) => {
      this.user = user;
      this.message = user ? `Hi ${user.first_name}` : 'Please log in';
      this.islogged = !!user;
    });
  }

  logout() {
    this.http
      .post(
        'http://127.0.0.1:8000/api/logout_user/',
        {},
        { withCredentials: true }
      )
      .subscribe((res) => {
        this.message = 'Please log in';
        this.islogged = false;
      });
    localStorage.removeItem('token');
    this.authService.clearUser();
  }
}
