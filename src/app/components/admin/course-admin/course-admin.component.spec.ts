import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAdminComponent } from './course-admin.component';

describe('CourseAdminComponent', () => {
  let component: CourseAdminComponent;
  let fixture: ComponentFixture<CourseAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
