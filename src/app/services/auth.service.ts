import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { Loginresponse } from '../interfaces/loginresponse';
import { User, UserResponse } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private $isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.$isLoggedIn.asObservable();
  jwt: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<Loginresponse>('http://localhost:3001/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((res: Loginresponse) => {
          localStorage.clear();
          localStorage.setItem('token', res.token);
          this.jwt = res.token;
          this.$isLoggedIn.next(true);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  signUp(user: Partial<User>): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      'http://localhost:3001/auth/register',
      user
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.jwt = '';
    this.$isLoggedIn.next(false);
  }
}
