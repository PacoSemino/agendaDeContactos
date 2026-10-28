import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../../interfaces/auth';
import {
  email,
  form,
  FormField,
  minLength,
  required
} from '@angular/forms/signals';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  
  authService = inject(Auth);
  router = inject(Router);

  async login(data: Login): Promise<boolean> {
    return await this.authService.login(data);
  }

  redirectToDashboard() {
    this.router.navigate(['/']);
  }

  loginModel = signal<Login>({
    email: '',
    password: ''
  });

  formLogin = form(this.loginModel, data => {
    required(data.email);
    email(data.email);
    required(data.password);
    minLength(data.password, 6);
  });
   
  async onsubmit(event: Event) {
    event.preventDefault();
    
    const result = await this.login(this.loginModel());
    if (result) {
      this.redirectToDashboard();
    }
  }
  


}
