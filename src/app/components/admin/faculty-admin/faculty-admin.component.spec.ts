import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyAdminComponent } from './faculty-admin.component';

describe('FacultyAdminComponent', () => {
  let component: FacultyAdminComponent;
  let fixture: ComponentFixture<FacultyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
