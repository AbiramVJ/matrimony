import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUserProfileComponent } from './main-user-profile.component';

describe('MainUserProfileComponent', () => {
  let component: MainUserProfileComponent;
  let fixture: ComponentFixture<MainUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainUserProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
