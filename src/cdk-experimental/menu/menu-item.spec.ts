import {Component, Type} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItem} from './menu-item';

describe('MenuItem', () => {
  describe('without enclosing elements', () => {
    let fixture: ComponentFixture<SingleMenuItem>;
    let menuItem: CdkMenuItem;
    let nativeButton: HTMLButtonElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [SingleMenuItem],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleMenuItem);
      fixture.detectChanges();

      menuItem = fixture.debugElement.query(By.directive(CdkMenuItem)).injector.get(CdkMenuItem);
      nativeButton = fixture.debugElement.query(By.directive(CdkMenuItem)).nativeElement;
    });

    it('should have the menuitem role', () => {
      expect(nativeButton.getAttribute('role')).toBe('menuitem');
    });

    it('should coerce the disabled property', () => {
      (menuItem as any).disabled = '';
      expect(menuItem.disabled).toBeTrue();
    });

    it('should toggle the aria disabled attribute', () => {
      expect(nativeButton.getAttribute('aria-disabled')).toBeNull();

      menuItem.disabled = true;
      fixture.detectChanges();

      expect(nativeButton.getAttribute('aria-disabled')).toBe('true');

      menuItem.disabled = false;
      fixture.detectChanges();

      expect(nativeButton.getAttribute('aria-disabled')).toBeNull();
    });

    it('should be a button type', () => {
      expect(nativeButton.getAttribute('type')).toBe('button');
    });

    it('should not have a menu', () => {
      expect(menuItem.hasMenu()).toBeFalse();
    });
  });

  describe('with complex inner elements', () => {
    let menuItem: CdkMenuItem;

    /**
     * Build a component for test and render it.
     * @param componentClass the component to create
     */
    function createComponent<T>(componentClass: Type<T>) {
      let fixture: ComponentFixture<T>;

      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [componentClass, MatIcon],
      }).compileComponents();

      fixture = TestBed.createComponent(componentClass);
      fixture.detectChanges();

      menuItem = fixture.debugElement.query(By.directive(CdkMenuItem)).injector.get(CdkMenuItem);
    }

    it('should get the text for a simple menu item', () => {
      createComponent(SingleMenuItem);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it('should get the text for menu item with mat icon component', () => {
      createComponent(MenuItemWithIcon);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it('should get the text for menu item with mat icon class', () => {
      createComponent(MenuItemWithIconClass);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it('should get the text for a menu item with nested element', () => {
      createComponent(MenuItemWithBoldElement);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });

    it('should get the text for a menu item with nested icon and nested elements', () => {
      createComponent(MenuItemWithMultipleNestings);
      expect(menuItem.getLabel()).toEqual('Click me!');
    });
  });
});

@Component({
  template: `<button cdkMenuItem>Click me!</button>`,
})
class SingleMenuItem {}

@Component({
  template: `
    <button cdkMenuItem>
      <mat-icon>unicorn</mat-icon>
      Click me!
    </button>
  `,
})
class MenuItemWithIcon {}
@Component({
  template: `
    <button cdkMenuItem>
      <div class="mat-icon">unicorn</div>
      Click me!
    </button>
  `,
})
class MenuItemWithIconClass {}

@Component({
  template: ` <button cdkMenuItem><b>Click</b> me!</button> `,
})
class MenuItemWithBoldElement {}

@Component({
  template: `
    <button cdkMenuItem>
      <div>
        <div>
          Click
        </div>
        <mat-icon>menu</mat-icon>
        <div>me<b>!</b></div>
      </div>
    </button>
  `,
})
class MenuItemWithMultipleNestings {}

@Component({
  selector: 'mat-icon',
  template: '<ng-content></ng-content>',
})
class MatIcon {}
