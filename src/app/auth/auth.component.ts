import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLogIn = true;
  isLoading = false;
  error:string = null;
  authObs:Observable<AuthResponse>

  constructor(private authService: AuthService, private router: Router) {}

  switchLogIn() {
    this.isLogIn = !this.isLogIn;
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (this.isLogIn) {
      this.authObs = this.authService.login(form.value.email, form.value.password)
    } else {
      this.authObs = this.authService.signup(form.value.email, form.value.password)
    }
    this.authObs.subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
        this.router.navigate(['/recipes']);
      },
      (error) => {
        this.isLoading = false;
        this.error = error;
      }
    );
    form.reset()
  }
}
