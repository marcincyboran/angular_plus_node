import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged: boolean;
  private isLoggedSub: Subscription;
  constructor(private authService: AuthService){}

  ngOnInit() {
    this.isLogged = this.authService.getIsUserLoggedInfo();
    this.isLoggedSub = this.authService.getAuthTokenSub().subscribe(isloggedData => {
      this.isLogged = isloggedData;
    });
  }

  onLogout() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.isLoggedSub.unsubscribe();
  }
}
