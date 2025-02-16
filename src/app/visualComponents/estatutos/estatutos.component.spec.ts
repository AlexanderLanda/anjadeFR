import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatutosComponent } from './estatutos.component';

describe('EstatutosComponent', () => {
  let component: EstatutosComponent;
  let fixture: ComponentFixture<EstatutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstatutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstatutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
