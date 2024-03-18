import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn!: boolean;
  userRole: string = '';
  constructor(private authSrv: AuthService, private router: Router) {
    this.authSrv.isLoggedIn.subscribe((res) => {
      console.log(res);
      this.isLoggedIn = res;
    });
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  logout() {
    this.authSrv.logout();
    this.router.navigate(['']);
  }
}
