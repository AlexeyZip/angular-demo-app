import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiInputComponent } from './ui-input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UiInputComponent],
  template: `<ui-input [formControl]="control" label="Name" />`,
})
class HostComponent {
  readonly control = new FormControl('', { nonNullable: true });
}

describe('UiInputComponent (CVA)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders value from form control', () => {
    host.control.setValue('Alpha');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Alpha');
  });

  it('updates form control on user input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Beta';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.control.value).toBe('Beta');
  });
});
