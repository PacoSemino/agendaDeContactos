import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContactsServices } from '../../services/contactsServices';
import  Swal  from 'sweetalert2';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-agenda',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {
  contactServices = inject(ContactsServices);
  
  auth = inject(Auth);
  contacts = computed(() =>
    [...this.contactServices.contactList()].sort(
      (a, b) => Number(b.isFavorite) - Number(a.isFavorite),
    ),
  );
  router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      await this.actualizarContactos();
    } catch (error) {
      console.error('Error al cargar los contactos:', error);
      await Swal.fire({
        icon: 'error',
        title: 'No se pudieron cargar los contactos',
        text: error instanceof Error ? error.message : 'Intentá nuevamente.',
      });
    }
  }

  logout() {
      this.auth.logout();
      this.router.navigate(['/login']);
    }

  async actualizarContactos(): Promise<void> {
    await this.contactServices.getContacts();
  }
  
  async eliminarContacto(id: string) {
    await this.contactServices.deleteContact(id);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Contacto eliminado',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
    });
  }

}
