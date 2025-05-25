import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMemberListComponent } from './filter-member-list.component';

describe('FilterMemberListComponent', () => {
  let component: FilterMemberListComponent;
  let fixture: ComponentFixture<FilterMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterMemberListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
