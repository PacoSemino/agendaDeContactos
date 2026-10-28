import { Component, inject, input, signal } from '@angular/core';
import { ContactsServices } from '../../services/contactsServices';
import { Contact } from '../../interfaces/contact';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agenda-details',
  imports: [RouterLink],
  templateUrl: './agendaDetails.html',
  styleUrl: './agendaDetails.scss',
})
export class AgendaDetails {
  id = input.required<string>();
  contactServices = inject(ContactsServices);
  contact = signal<Contact | undefined>(undefined);
  loading = signal(true);
  error = signal('');

  async ngOnInit(): Promise<void> {
    try {
      this.contact.set(await this.contactServices.getContactById(this.id()));
    } catch (error) {
      console.error('Error al cargar el contacto:', error);
      this.error.set(
        error instanceof Error ? error.message : 'No se pudo cargar el contacto.',
      );
    } finally {
      this.loading.set(false);
    }
  }  
}
