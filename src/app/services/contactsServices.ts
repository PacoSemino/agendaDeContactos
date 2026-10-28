import { Injectable, inject, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ContactsServices {
  private auth = inject(Auth);
  contactList = signal<Contact[]>([]);

  private headers(json = false): HeadersInit {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.auth.token}`,
    };

    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  async getContacts(): Promise<Contact[]> {
    const response = await fetch('http://localhost:5000/api/Contacts', {
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`No se pudieron cargar los contactos (${response.status})`);
    }

    const contacts = await response.json() as Contact[];
    this.contactList.set(contacts);
    return contacts;
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const response = await fetch(`http://localhost:5000/api/Contacts/${id}`, {
      headers: this.headers(),
    });

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`No se pudo cargar el contacto (${response.status})`);
    }

    return await response.json() as Contact;
  }

  async addContact(contact: Contact): Promise<Contact> {
    const { isFavorite, ...contactData } = contact;
    const response = await fetch('http://localhost:5000/api/Contacts', {
      method: 'POST',
      headers: this.headers(true),
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`No se pudo crear el contacto (${response.status})`);
    }

    const createdContact = await response.json() as Contact;
    this.contactList.update((contacts) => [...contacts, createdContact]);
    return createdContact;
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const response = await fetch(`http://localhost:5000/api/Contacts/${id}/favorite`, {
      method: 'POST',
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`No se pudo actualizar el favorito (${response.status})`);
    }

    const contact = this.contactList().find((item) => item.id === id);
    if (contact) {
      this.contactList.update((contacts) =>
        contacts.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        ),
      );
    }

    return true;
  }

  async actualizarContactos(contact: Contact): Promise<boolean> {
    const { isFavorite, ...contactData } = contact;
    const response = await fetch(`http://localhost:5000/api/Contacts/${contact.id}`, {
      method: 'PUT',
      headers: this.headers(true),
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`No se pudo actualizar el contacto (${response.status})`);
    }

    this.contactList.update((contacts) =>
      contacts.map((current) => current.id === contact.id ? contact : current),
    );
    return true;
  }

  async deleteContact(id: string): Promise<boolean> {
    const response = await fetch(`http://localhost:5000/api/Contacts/${id}`, {
      method: 'DELETE',
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`No se pudo eliminar el contacto (${response.status})`);
    }

    this.contactList.update((contacts) =>
      contacts.filter((contact) => contact.id !== id),
    );
    return true;
  }
}
