import { Component, inject, input, signal } from '@angular/core';
import { ContactsServices } from '../../services/contactsServices';
import { Contact } from '../../interfaces/contact';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-edit-contact',
  imports: [FormField],
  templateUrl: './createEditContact.html',
  styleUrl: './createEditContact.scss',
})
export class CreateEditContact {

  id = input<string>();

  contactServices = inject(ContactsServices);
  router = inject(Router);
  
  newContact = signal<Contact>({
    id: '',
    firstName: '',
    lastName: '',
    number: '',
    address: '',
    email: '',
    company: '',
    description: '',
    isFavorite: false
  });

  submitting = signal(false);
  originalFavorite = false;

  async ngOnInit(): Promise<void> {
    if (this.id()) {
      const contact = await this.contactServices.getContactById(this.id()!);
      if (contact) {
        this.newContact.set(contact);
        this.originalFavorite = contact.isFavorite;
      }
    }
  }
  
  formCreate = form(this.newContact);
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    try {
      if (this.id()) {
        await this.actualizarContacto();
      } else {
        await this.crearContacto();
      }
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
      await this.swal().fire({
        icon: 'error',
        title: 'No se pudo guardar el contacto',
        text: error instanceof Error
          ? error.message
          : 'Verificá que la API esté disponible e intentá nuevamente.',
      });
    } finally {
      this.submitting.set(false);
    }
  }

  async crearContacto(): Promise<void> {
    const createdContact = await this.contactServices.addContact(this.newContact());
    if (createdContact.isFavorite) {
      await this.contactServices.toggleFavorite(createdContact.id);
      this.contactServices.contactList.update((contacts) =>
        contacts.map((item) =>
          item.id === createdContact.id ? { ...item, isFavorite: true } : item,
        ),
      );
    }

    await this.swal().fire({
      icon: 'success',
      title: 'Contacto creado',
    });
    await this.router.navigate(['/']);
  }

  async actualizarContacto(): Promise<void> {
    const contact = this.newContact();
    const actualizado = await this.contactServices.actualizarContactos(contact);
    if (!actualizado) {
      await this.swal().fire({
        icon: 'error',
        title: 'No se pudo editar el contacto',
      });
      return;
    }

    if (contact.isFavorite !== this.originalFavorite) {
      await this.contactServices.toggleFavorite(contact.id);
      this.contactServices.contactList.update((contacts) =>
        contacts.map((item) =>
          item.id === contact.id ? { ...item, isFavorite: contact.isFavorite } : item,
        ),
      );
    }

    await this.swal().fire({
      icon: 'success',
      title: 'Contacto editado',
    });
    await this.router.navigate(['/']);
  }

  swal(){
    return Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      theme: 'dark',
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }

}
