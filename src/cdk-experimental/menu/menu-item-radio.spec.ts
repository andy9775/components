import {Component} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItemRadio} from './menu-item-radio';
import {By} from '@angular/platform-browser';
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';

describe('MenuItemRadio', () => {
  let fixture: ComponentFixture<SimpleRadioButton>;
  let radioButton: CdkMenuItemRadio;
  let nativeButton: HTMLButtonElement;
  let selectionDispatcher: UniqueSelectionDispatcher;

  beforeEach(async(() => {
    selectionDispatcher = new UniqueSelectionDispatcher();
    TestBed.configureTestingModule({
      imports: [CdkMenuModule],
      declarations: [SimpleRadioButton],
      providers: [{provide: UniqueSelectionDispatcher, useValue: selectionDispatcher}],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleRadioButton);
    fixture.detectChanges();

    radioButton = fixture.debugElement
      .query(By.directive(CdkMenuItemRadio))
      .injector.get(CdkMenuItemRadio);

    nativeButton = fixture.debugElement.query(By.directive(CdkMenuItemRadio)).nativeElement;
  }));

  it('should have the menuitemradio role', () => {
    expect(nativeButton.getAttribute('role')).toEqual('menuitemradio');
  });

  it('should set the aria disabled attribute', () => {
    expect(nativeButton.getAttribute('aria-disabled')).toBeNull();

    radioButton.disabled = true;
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-disabled')).toEqual('true');
  });

  it('should be a button type', () => {
    expect(nativeButton.getAttribute('type')).toEqual('button');
  });

  it('should not have a submenu', () => {
    expect(radioButton.hasSubmenu).toBeFalse();
  });

  it('should toggle the aria checked attribute', () => {
    expect(nativeButton.getAttribute('aria-checked')).toEqual('false');

    radioButton.trigger();
    fixture.detectChanges();

    expect(nativeButton.getAttribute('aria-checked')).toEqual('true');
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

  it('should emit name and id when clicked', () => {
    const spy = jasmine.createSpy('Selection Dispatcher spy');
    selectionDispatcher.listen(spy);
    const id = 'id-1';
    const name = 'name-1';
    radioButton.id = id;
    radioButton.name = name;

    radioButton.trigger();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(id, name);
  });

  it('should toggle state when called with own id and differing id', () => {
    const id = 'id-1';
    const name = 'name-1';
    radioButton.id = id;
    radioButton.name = name;

    expect(radioButton.checked).toBeFalse();

    selectionDispatcher.notify(id, name);

    expect(radioButton.checked).toBeTrue();

    selectionDispatcher.notify('another-id', 'another-name');

    expect(radioButton.checked).toBeFalse();
  });
});

@Component({
  template: `<button cdkMenuItemRadio>Click me!</button>`,
})
class SimpleRadioButton {}
