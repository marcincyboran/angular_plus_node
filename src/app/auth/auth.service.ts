import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.interface';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authToken: string;
  private logoutTimer: any;

  // Post list component is loaded AFTER we get token so he dont get event from obs.
  // We can use BehaviourSubject instead or create new property adn getter to check if we are logged:
  private isUserLogged = false;
  authTokenSub = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.authToken;
  }

  getIsUserLoggedInfo(): boolean {
    return this.isUserLogged;
  }

  getAuthTokenSub(): Observable<boolean> {
    return this.authTokenSub.asObservable();
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = { email, password };

    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    console.log(authData);
    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/users/login',
        authData
      )
      .subscribe(response => {
        console.log('Login method:', response);
        if (response.token) {
          this.logoutTimer = setTimeout(() => {
            this.logoutUser();
          }, response.expiresIn * 1000);
          this.saveData(response.token, new Date(Date.now() + response.expiresIn * 1000));
          this.authToken = response.token;
          this.isUserLogged = true;
          this.authTokenSub.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logoutUser(): void {
    clearTimeout(this.logoutTimer);
    this.clearSavedData();
    this.authToken = null;
    this.isUserLogged = false;
    this.authTokenSub.next(false);
    this.router.navigate(['/']);
  }

  getAllUsers(): void {
    this.http.get('http://localhost:3000/api/users/').subscribe(response => {
      console.table(response);
    });
  }

  saveData(token: string, expDate: Date): void {
    console.log(expDate);
    localStorage.setItem('XYZ-token', token);
    localStorage.setItem('XYZ-expirationDate', expDate.toISOString());
  }

  clearSavedData(): void {
    localStorage.removeItem('XYZ-token');
    localStorage.removeItem('XYZ-expirationDate');
  }

  autoLogin() {
    const token = localStorage.getItem('XYZ-token');
    const expDate = localStorage.getItem('XYZ-expirationDate');
    const remainTime = new Date(expDate).getTime() - Date.now();

    if (remainTime < 0 ) {
      return;
    }

    this.authToken = token;
    this.isUserLogged = true;
    this.authTokenSub.next(true);
  }
}
