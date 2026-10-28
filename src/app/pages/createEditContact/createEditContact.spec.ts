import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditContact } from './createEditContact';

describe('CreateEditContact', () => {
  let component: CreateEditContact;
  let fixture: ComponentFixture<CreateEditContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditContact],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
