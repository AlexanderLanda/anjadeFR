import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCuestionarioDetailsComponent } from './user-cuestionario-details.component';

describe('UserCuestionarioDetailsComponent', () => {
  let component: UserCuestionarioDetailsComponent;
  let fixture: ComponentFixture<UserCuestionarioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [UserCuestionarioDetailsComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCuestionarioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
