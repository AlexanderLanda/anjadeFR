import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglamentosFileGalleryComponent } from './reglamentos-file-gallery.component';

describe('ReglamentosFileGalleryComponent', () => {
  let component: ReglamentosFileGalleryComponent;
  let fixture: ComponentFixture<ReglamentosFileGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [ReglamentosFileGalleryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglamentosFileGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
