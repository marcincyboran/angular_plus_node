import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private authService: AuthService){}

    onLogin(ngForm: NgForm) {
      this.authService.loginUser(ngForm.value.email, ngForm.value.password);
    }
}
