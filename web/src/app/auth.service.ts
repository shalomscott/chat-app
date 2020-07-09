import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username: string = null;
  private password: string = null;

  constructor() {}

  submitCredentials({ username, password }): Promise<boolean> {
    this.username = username;
    this.password = password;
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 200);
    });
  }

  getCurrentUser() {
    return this.username;
  }
}
