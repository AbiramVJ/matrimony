import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligionComponent } from './religion.component';

describe('ReligionComponent', () => {
  let component: ReligionComponent;
  let fixture: ComponentFixture<ReligionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReligionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReligionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
