import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbbidenComponent } from './forbbiden.component';

describe('ForbbidenComponent', () => {
  let component: ForbbidenComponent;
  let fixture: ComponentFixture<ForbbidenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ForbbidenComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbbidenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
