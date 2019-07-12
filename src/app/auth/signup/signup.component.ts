import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    constructor(private authService: AuthService){}

    onRegister(ngForm: NgForm) {
        this.authService.createUser(ngForm.value.email, ngForm.value.password);
    }

    ngOnInit() {
        this.authService.getAllUsers();
    }
}