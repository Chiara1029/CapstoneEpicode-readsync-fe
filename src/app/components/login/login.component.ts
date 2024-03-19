import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorService } from '../../services/errors.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error!: string | null;
  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private errorSrv: ErrorService
  ) {
    this.errorSrv.error.subscribe((res) => {
      console.log(res);
      this.error = res;
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authSrv.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = err.error.message;
      },
    });
  }
}
