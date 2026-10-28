import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDetails } from './agendaDetails';

describe('AgendaDetails', () => {
  let component: AgendaDetails;
  let fixture: ComponentFixture<AgendaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaDetails);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
