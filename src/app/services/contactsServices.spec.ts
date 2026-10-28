import { TestBed } from '@angular/core/testing';

import { ContactsServices } from './contactsServices';

describe('ContactsServices', () => {
  let service: ContactsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
