import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Login, Register, registerRequest } from '../interfaces/auth';

interface AuthenticationResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly platformId = inject(PLATFORM_ID);
  token = this.getStoredToken();

  private getStoredToken(): string {
    return isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem('token') || ''
      : '';
  }

  async login(loginData: Login): Promise<boolean> {
    const response = await fetch('http://localhost:5000/api/authentication/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    return this.saveAuthenticationToken(response);
  }

  async register(register: Register): Promise<boolean> {
    const registerData: registerRequest = {
      firstName: register.firstName,
      lastName: register.lastName,
      email: register.email,
      password: register.password,
    };

    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });

    return this.saveAuthenticationToken(response);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('token');
    }
    this.token = '';
  }

  private async saveAuthenticationToken(response: Response): Promise<boolean> {
    if (!response.ok) {
      return false;
    }

    const authorizationHeader = response.headers.get('Authorization');
    const body = await response.text();
    const token = this.extractToken(authorizationHeader || body);

    if (!token) {
      console.error(
        'La API de autenticación no devolvió un JWT. Respuesta recibida:',
        body,
      );
      this.logout();
      return false;
    }

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('token', token);
    }
    this.token = token;
    return true;
  }

  private extractToken(value: string): string | undefined {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return undefined;
    }

    if (trimmedValue.startsWith('Bearer ')) {
      return trimmedValue.slice('Bearer '.length).trim();
    }

    try {
      const parsed = JSON.parse(trimmedValue) as AuthenticationResponse | string;
      if (typeof parsed === 'string') {
        return parsed.trim() || undefined;
      }

      return parsed.token?.trim() || parsed.accessToken?.trim() || parsed.jwt?.trim();
    } catch {
      return trimmedValue;
    }
  }
}
