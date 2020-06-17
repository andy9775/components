import {Component} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItemCheckbox} from './menu-item-checkbox';
import {By} from '@angular/platform-browser';
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';

describe('MenuItemRadio', () => {
  let fixture: ComponentFixture<SimpleCheckbox>;
  let radioButton: CdkMenuItemCheckbox;
  let nativeButton: HTMLButtonElement;
  let selectionDispatcher: UniqueSelectionDispatcher;

  beforeEach(async(() => {
    selectionDispatcher = new UniqueSelectionDispatcher();
    TestBed.configureTestingModule({
      imports: [CdkMenuModule],
      declarations: [SimpleCheckbox],
      providers: [{provide: UniqueSelectionDispatcher, useValue: selectionDispatcher}],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleCheckbox);
    fixture.detectChanges();

    radioButton = fixture.debugElement
      .query(By.directive(CdkMenuItemCheckbox))
      .injector.get(CdkMenuItemCheckbox);

    nativeButton = fixture.debugElement.query(By.directive(CdkMenuItemCheckbox)).nativeElement;
  }));

  it('should have the menuitemcheckbox role', () => {
    expect(nativeButton.getAttribute('role')).toBe('menuitemcheckbox');
  });

  it('should set the aria disabled attribute', () => {
    expect(nativeButton.getAttribute('aria-disabled')).toBeNull();

    radioButton.disabled = true;
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('should be a button type', () => {
    expect(nativeButton.getAttribute('type')).toBe('button');
  });

  it('should not have a submenu', () => {
    expect(radioButton.hasSubmenu).toBeFalse();
  });

  it('should toggle the aria checked attribute', () => {
    expect(nativeButton.getAttribute('aria-checked')).toBe('false');

    radioButton.trigger();
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-checked')).toBe('true');
  });

  it('should not toggle checked state when disabled', () => {
    radioButton.disabled = true;
    radioButton.trigger();

    expect(radioButton.checked).toBeFalse();
  });

  it('should emit on clicked emitter when triggered', () => {
    const spy = jasmine.createSpy('cdkMenuItemRadio clicked spy');
    radioButton.clicked.subscribe(spy);

    radioButton.trigger();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit on clicked emitter when disabled', () => {
    const spy = jasmine.createSpy('cdkMenuItemRadio clicked spy');
    radioButton.clicked.subscribe(spy);
    radioButton.disabled = true;

    radioButton.trigger();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

@Component({
  template: `<button cdkMenuItemCheckbox>Click me!</button>`,
})
class SimpleCheckbox {}
