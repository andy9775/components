import {Component} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItem} from './menu-item';

describe('MenuItemRadio', () => {
  let fixture: ComponentFixture<SimpleMenuItem>;
  let radioButton: CdkMenuItem;
  let nativeButton: HTMLButtonElement;
  let selectionDispatcher: UniqueSelectionDispatcher;

  beforeEach(async(() => {
    selectionDispatcher = new UniqueSelectionDispatcher();
    TestBed.configureTestingModule({
      imports: [CdkMenuModule],
      declarations: [SimpleMenuItem],
      providers: [{provide: UniqueSelectionDispatcher, useValue: selectionDispatcher}],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleMenuItem);
    fixture.detectChanges();

    radioButton = fixture.debugElement.query(By.directive(CdkMenuItem)).injector.get(CdkMenuItem);

    nativeButton = fixture.debugElement.query(By.directive(CdkMenuItem)).nativeElement;
  }));

  it('should have the menuitem role', () => {
    expect(nativeButton.getAttribute('role')).toBe('menuitem');
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
});

@Component({
  template: `<button cdkMenuItem>Click me!</button>`,
})
class SimpleMenuItem {}
