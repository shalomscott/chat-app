import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
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
    this.loginForm = formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            this.usernameTakenValidator(),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^\w+$/),
          ],
        ],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {}

  hasErrors(fieldName: string): boolean {
    const control = this.loginForm.controls[fieldName];
    return Boolean(control.touched && control.errors);
  }

  getErrorMessage(fieldName: string): string | undefined {
    const control = this.loginForm.controls[fieldName];
    if (control.errors) {
      switch (Object.keys(control.errors)[0]) {
        case 'required':
          return 'Field requires a non empty value.';
        case 'minlength':
          return `A minimum of ${control.errors.minlength.requiredLength} characters is required.`;
        case 'usernameTaken':
          return 'That username is already in use.';
        case 'pattern':
          return 'Only alpha-numerical characters are allowed.';
      }
    }
  }

  submit(): void {
    const { username, password } = this.loginForm.value;
    this.auth
      .submitCredentials({
        username,
        password,
      })
      .then((success) => {
        if (success) {
          this.router.navigateByUrl('/messaging');
        }
      });
  }

  usernameTakenValidator(): ValidatorFn {
    return () => {
      return Math.round(Math.random() * 10) % 2 === 0
        ? { usernameTaken: true }
        : null;
    };
  }
}
