// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // store the current user (or null if not logged in)
  private userSubject = new BehaviorSubject<User | null>(null);

  // public stream that components can subscribe to
  public user$: Observable<User | null> = this.userSubject.asObservable();

  // call this to update the user
  setUser(user: User) {
    this.userSubject.next(user);
  }

  // call this to clear on logout
  clearUser() {
    this.userSubject.next(null);
  }
}
