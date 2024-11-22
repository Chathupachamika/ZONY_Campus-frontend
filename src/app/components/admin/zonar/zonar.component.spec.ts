import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonarComponent } from './zonar.component';

describe('ZonarComponent', () => {
  let component: ZonarComponent;
  let fixture: ComponentFixture<ZonarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
