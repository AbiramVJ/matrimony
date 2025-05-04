import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProfileFormComponent } from './member-profile-form.component';

describe('MemberProfileFormComponent', () => {
  let component: MemberProfileFormComponent;
  let fixture: ComponentFixture<MemberProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberProfileFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
