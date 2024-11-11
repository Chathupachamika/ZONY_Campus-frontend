import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAdminComponent } from './program-admin.component';

describe('ProgramAdminComponent', () => {
  let component: ProgramAdminComponent;
  let fixture: ComponentFixture<ProgramAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
