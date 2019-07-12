import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.interface';

@Injectable({ providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient) {}

    createUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        console.log(authData);

        this.http
            .post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                console.log(response)
            })
    }

    getAllUsers() {
        this.http
            .get('http://localhost:3000/api/users/')
            .subscribe(response => {
                console.log(response)
            })
    }
}
