import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  apiEndpoint: string = 'http://localhost:3000';
  userApiRoot: string = '/api/users';
  constructor(private http: Http) { }

  getUserApi(route) {
    return `${this.apiEndpoint}${this.userApiRoot}${route}`;
  }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.getUserApi('/register'), user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.getUserApi('/login'), user, {headers: headers})  
      .pipe(map(res => res.json()));
  }

  storeUserData(data) {
    this.authToken = data.token;
    this.user = data.user;
    const expiresAt = moment().add(data.expiresIn, 'second');
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
