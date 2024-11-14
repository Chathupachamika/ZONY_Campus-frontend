import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAdminComponent } from './about-admin.component';

describe('AboutAdminComponent', () => {
  let component: AboutAdminComponent;
  let fixture: ComponentFixture<AboutAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
