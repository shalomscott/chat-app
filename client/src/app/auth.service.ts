import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username: string | null;
  private password: string | null;

  constructor() {
    this.username = null;
    this.password = null;
  }

  submitCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<boolean> {
    this.username = username;
    this.password = password;
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 200);
    });
  }

  getCurrentUser(): string | null {
    return this.username;
  }
}
