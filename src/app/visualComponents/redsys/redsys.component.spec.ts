import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedsysComponent } from './redsys.component';

describe('RedsysComponent', () => {
  let component: RedsysComponent;
  let fixture: ComponentFixture<RedsysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedsysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedsysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
