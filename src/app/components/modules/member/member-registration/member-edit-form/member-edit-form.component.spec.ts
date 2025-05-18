import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEditFormComponent } from './member-edit-form.component';

describe('MemberEditFormComponent', () => {
  let component: MemberEditFormComponent;
  let fixture: ComponentFixture<MemberEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
