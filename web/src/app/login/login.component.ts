import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = formBuilder.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(): void {}

  submit() {
    const { username, password } = this.loginForm.value;
    this.auth
      .submitCredentials({
        username,
        password,
      })
      .then((success) => {
        if (success) this.router.navigateByUrl('/messaging');
      });
  }
}
