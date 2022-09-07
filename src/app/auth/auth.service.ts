import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localid: string;
  registered?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private expirationTimer: any

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAW-o965JXm_kv5QA--b9jyxnCziQ6si_Y',
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localid,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAW-o965JXm_kv5QA--b9jyxnCziQ6si_Y',
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localid,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData')
    if(this.expirationTimer){
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  autoLogin() {
    const localData = JSON.parse(localStorage.getItem('userData'));
    if (!localData) {
      return;
    }
    const user = new User(
      localData.email,
      localData.id,
      localData._token,
      new Date(localData._tokenExpirationDate)
    );
    if (user.token) {
      this.user.next(user);
      const expireTime = new Date(localData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogOut(expireTime * 1000)
    }


  }

  autoLogOut(expirationDuration: number) {
    this.expirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration);
  }

  handleAuthentication(
    email: string,
    id: string,
    token: string,
    expireIn: number
  ) {
    const user = new User(
      email,
      id,
      token,
      new Date(new Date().getTime() + expireIn * 1000),
    );

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log(expireIn * 1000)
    this.autoLogOut(expireIn * 1000);
  }

  handleError(resError: HttpErrorResponse) {
    let errorMessage = 'An Unkown Error';
    if (!resError.error || !resError.error.error) {
      return throwError(errorMessage);
    }

    switch (resError.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted';
        break;
      case 'INVALID_PASSWORD':
        errorMessage =
          'The password is invalid or the user does not have a password';
        break;
    }
    return throwError(errorMessage);
  }
}
