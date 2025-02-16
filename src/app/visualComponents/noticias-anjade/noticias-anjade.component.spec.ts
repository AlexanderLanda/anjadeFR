import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasAnjadeComponent } from './noticias-anjade.component';

describe('NoticiasAnjadeComponent', () => {
  let component: NoticiasAnjadeComponent;
  let fixture: ComponentFixture<NoticiasAnjadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasAnjadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticiasAnjadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
