import {Component} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItemCheckbox} from './menu-item-checkbox';

describe('MenuItemCheckbox', () => {
  let fixture: ComponentFixture<SingleCheckboxButton>;
  let checkbox: CdkMenuItemCheckbox;
  let nativeButton: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CdkMenuModule],
      declarations: [SingleCheckboxButton],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleCheckboxButton);
    fixture.detectChanges();

    checkbox = fixture.debugElement
      .query(By.directive(CdkMenuItemCheckbox))
      .injector.get(CdkMenuItemCheckbox);

    nativeButton = fixture.debugElement.query(By.directive(CdkMenuItemCheckbox)).nativeElement;
  }));

  it('should have the menuitemcheckbox role', () => {
    expect(nativeButton.getAttribute('role')).toBe('menuitemcheckbox');
  });

  it('should set the aria disabled attribute', () => {
    expect(nativeButton.getAttribute('aria-disabled')).toBeNull();

    checkbox.disabled = true;
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('should be a button type', () => {
    expect(nativeButton.getAttribute('type')).toBe('button');
  });

  it('should not have a submenu', () => {
    expect(checkbox.hasSubmenu).toBeFalse();
  });

  it('should toggle the aria checked attribute', () => {
    expect(nativeButton.getAttribute('aria-checked')).toBe('false');

    checkbox.trigger();
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-checked')).toBe('true');
  });

  it('should toggle checked state', () => {
    expect(checkbox.checked).toBeFalse();
    checkbox.trigger();
    expect(checkbox.checked).toBeTrue();
    checkbox.trigger();
    expect(checkbox.checked).toBeFalse();
  });

  it('should not toggle checked state when disabled', () => {
    checkbox.disabled = true;
    checkbox.trigger();

    expect(checkbox.checked).toBeFalse();
  });

  it('should emit on clicked emitter when triggered', () => {
    const spy = jasmine.createSpy('cdkMenuItemCheckbox clicked spy');
    checkbox.clicked.subscribe(spy);

    checkbox.trigger();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit on clicked emitter when disabled', () => {
    const spy = jasmine.createSpy('cdkMenuItemCheckbox clicked spy');
    checkbox.clicked.subscribe(spy);
    checkbox.disabled = true;

    checkbox.trigger();

    expect(spy).not.toHaveBeenCalled();
  });
});

@Component({
  template: `<button cdkMenuItemCheckbox>Click me!</button>`,
})
class SingleCheckboxButton {}
