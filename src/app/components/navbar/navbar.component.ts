import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/interfaces/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn!: boolean;
  userRole: string = '';
  userId!: string;
  user!: UserResponse;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authSrv.isLoggedIn.subscribe((res) => {
      console.log(res);
      this.isLoggedIn = res;
    });
  }

  ngOnInit() {
    this.authSrv.isLoggedIn.subscribe((res) => {
      console.log(res);
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.fetchUserId();
      }
    });
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  logout() {
    this.authSrv.logout();
    this.router.navigate(['']);
  }

  fetchUserId() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any>('http://localhost:3001/users/me', { headers }).subscribe(
      (response) => {
        this.userId = response.toString();
        this.fetchUserDetails();
      },
      (error) => {
        console.error('Error fetching user id:', error);
      }
    );
  }

  fetchUserDetails() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    this.http
      .get<any>(`http://localhost:3001/users/${this.userId}`, { headers })
      .subscribe(
        (response) => {
          this.user = response;
          this.userRole = response.userRole;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }
}
