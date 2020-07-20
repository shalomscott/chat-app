import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private username: string | null;
  private password: string | null;

  constructor(private router: Router) {
    this.username = null;
    this.password = null;
  }

  canActivate(): boolean {
    if (this.username === null) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
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
