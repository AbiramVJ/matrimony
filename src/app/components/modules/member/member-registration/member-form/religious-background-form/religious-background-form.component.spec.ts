import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligiousBackgroundFormComponent } from './religious-background-form.component';

describe('ReligiousBackgroundFormComponent', () => {
  let component: ReligiousBackgroundFormComponent;
  let fixture: ComponentFixture<ReligiousBackgroundFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReligiousBackgroundFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReligiousBackgroundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
