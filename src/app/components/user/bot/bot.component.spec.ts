import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotComponent } from './bot.component';

describe('BotComponent', () => {
  let component: BotComponent;
  let fixture: ComponentFixture<BotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
