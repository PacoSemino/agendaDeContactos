import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Register } from '../../interfaces/auth';
import { email, form, minLength, required, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  registerModel = signal<Register>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''  
  });

  authService = inject(Auth);
  router = inject(Router);

  async register(data: Register): Promise<boolean> {
      return await this.authService.register(data);
  }

  redirectToDashboard() {
    this.router.navigate(['/']);
  }

  formRegister = form(this.registerModel, data => {
    required(data.firstName);
    required(data.lastName);
    required(data.email);
    email(data.email);
    required(data.password);
    minLength(data.password, 6);
    required(data.confirmPassword);
    minLength(data.confirmPassword, 6);
  });

  async onsubmit(event: Event): Promise<void> {
    event.preventDefault();
   
    const result = await this.register(this.registerModel());
    if (result) {
      this.redirectToDashboard();
    }
  }
}
