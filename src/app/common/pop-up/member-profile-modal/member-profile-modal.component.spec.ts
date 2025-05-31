import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProfileModalComponent } from './member-profile-modal.component';

describe('MemberProfileModalComponent', () => {
  let component: MemberProfileModalComponent;
  let fixture: ComponentFixture<MemberProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberProfileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
