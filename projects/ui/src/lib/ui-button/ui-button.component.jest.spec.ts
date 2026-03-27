import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButtonComponent } from './ui-button.component';

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<UiButtonComponent>;
  let component: UiButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
  });

  it('applies variant class and aria label', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('ariaLabel', 'Save changes');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('secondary')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Save changes');
  });

  it('emits clicked event on click', () => {
    const emitSpy = jest.spyOn(component.clicked, 'emit');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
