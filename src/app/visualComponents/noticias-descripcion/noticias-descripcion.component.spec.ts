import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasDescripcionComponent } from './noticias-descripcion.component';

describe('NoticiasDescripcionComponent', () => {
  let component: NoticiasDescripcionComponent;
  let fixture: ComponentFixture<NoticiasDescripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasDescripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasDescripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
