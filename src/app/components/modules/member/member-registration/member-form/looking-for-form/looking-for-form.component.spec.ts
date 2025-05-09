import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookingForFormComponent } from './looking-for-form.component';

describe('LookingForFormComponent', () => {
  let component: LookingForFormComponent;
  let fixture: ComponentFixture<LookingForFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookingForFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookingForFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
