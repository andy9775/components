import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CdkMenu} from './menu';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItemCheckbox} from './menu-item-checkbox';

describe('Menu', () => {
  describe('as checkbox group', () => {
    let fixture: ComponentFixture<MenuCheckboxGroup>;
    let menuItems: CdkMenuItemCheckbox[];

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [MenuCheckboxGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuCheckboxGroup);

      fixture.detectChanges();

      menuItems = fixture.debugElement
        .queryAll(By.directive(CdkMenuItemCheckbox))
        .map(element => element.injector.get(CdkMenuItemCheckbox));
    }));

    it('should toggle menuitemcheckbox', () => {
      expect(menuItems[0].checked).toBeTrue();
      expect(menuItems[1].checked).toBeFalse();

      menuItems[1].trigger();
      expect(menuItems[0].checked).toBeTrue(); // checkbox should not change

      menuItems[0].trigger();

      expect(menuItems[0].checked).toBeFalse();
      expect(menuItems[1].checked).toBeTrue();
    });
  });

  describe('checkbox change events', () => {
    let fixture: ComponentFixture<MenuCheckboxGroup>;
    let menuItems: CdkMenuItemCheckbox[];

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [MenuCheckboxGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuCheckboxGroup);

      fixture.detectChanges();

      menuItems = fixture.debugElement
        .queryAll(By.directive(CdkMenuItemCheckbox))
        .map(element => element.injector.get(CdkMenuItemCheckbox));
    }));

    it('should emit on click', () => {
      const spy = jasmine.createSpy('cdkMenu change spy');
      fixture.debugElement.query(By.directive(CdkMenu)).injector.get(CdkMenu).change.subscribe(spy);

      menuItems[0].trigger();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(menuItems[0]);
    });
  });
});

@Component({
  template: `
    <ul cdkMenu>
      <li role="none">
        <button checked="true" cdkMenuItemCheckbox>
          first
        </button>
      </li>
      <li role="none">
        <button cdkMenuItemCheckbox>
          second
        </button>
      </li>
    </ul>
  `,
})
class MenuCheckboxGroup {}
