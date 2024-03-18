import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
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
        map((res: Loginresponse) => {
          // localStorage.setItem('token', res.accessToken);
          this.jwt = res.accessToken;
          this.$isLoggedIn.next(true);
          return res;
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
    // localStorage.removeItem('token');
    this.jwt = '';
    this.$isLoggedIn.next(false);
  }
}
