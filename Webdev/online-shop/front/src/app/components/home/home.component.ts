import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ) {}

  user: User | null = null;
  ngOnInit() {
    this.authService.user$.subscribe((u) => (this.user = u));
    console.log(this.user);
  }
}
