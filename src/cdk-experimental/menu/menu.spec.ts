import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Component, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {TAB} from '@angular/cdk/keycodes';
import {dispatchKeyboardEvent, dispatchMouseEvent} from '@angular/cdk/testing/private';
import {By} from '@angular/platform-browser';
import {CdkMenu} from './menu';
import {CdkMenuModule} from './menu-module';
import {CdkMenuItemCheckbox} from './menu-item-checkbox';
import {CdkMenuItem} from './menu-item';
import {CdkMenuPanel} from './menu-panel';
import {MenuStack} from './menu-stack';
import {CdkMenuGroup} from './menu-group';
import {CdkMenuItemTrigger} from './menu-item-trigger';
import {CdkMenuBar} from './menu-bar';

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

      fixture.componentInstance.panel._menuStack = new MenuStack();
      fixture.componentInstance.trigger.getMenuTrigger()?.toggle();
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

      fixture.componentInstance.panel._menuStack = new MenuStack();
      fixture.componentInstance.trigger.getMenuTrigger()?.toggle();
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

  describe('with inner group', () => {
    let fixture: ComponentFixture<MenuWithNestedGroup>;
    let menuItems: CdkMenuItemCheckbox[];
    let menu: CdkMenu;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [MenuWithNestedGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuWithNestedGroup);
      fixture.detectChanges();

      fixture.componentInstance.panel._menuStack = new MenuStack();
      fixture.componentInstance.trigger.getMenuTrigger()?.toggle();
      fixture.detectChanges();

      menu = fixture.debugElement.query(By.directive(CdkMenu)).injector.get(CdkMenu);

      menuItems = fixture.debugElement
        .queryAll(By.directive(CdkMenuItemCheckbox))
        .map(element => element.injector.get(CdkMenuItemCheckbox));
    }));

    it('should not emit change from root menu ', () => {
      const spy = jasmine.createSpy('changeSpy for root menu');
      menu.change.subscribe(spy);

      for (let menuItem of menuItems) {
        menuItem.trigger();
      }

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('with inner group render delayed', () => {
    let fixture: ComponentFixture<MenuWithConditionalGroup>;
    let menuItems: CdkMenuItemCheckbox[];
    let menu: CdkMenu;

    const getMenuItems = () => {
      return fixture.debugElement
        .queryAll(By.directive(CdkMenuItemCheckbox))
        .map(element => element.injector.get(CdkMenuItemCheckbox));
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [MenuWithConditionalGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuWithConditionalGroup);
      fixture.detectChanges();

      fixture.componentInstance.panel._menuStack = new MenuStack();
      fixture.componentInstance.trigger.getMenuTrigger()?.toggle();
      fixture.detectChanges();

      menu = fixture.debugElement.query(By.directive(CdkMenu)).injector.get(CdkMenu);
      menuItems = getMenuItems();
    }));

    it('should not emit after the menu group element renders', () => {
      const spy = jasmine.createSpy('cdkMenu change');
      menu.change.subscribe(spy);

      menuItems[0].trigger();
      fixture.componentInstance.renderInnerGroup = true;
      fixture.detectChanges();

      menuItems = getMenuItems();
      menuItems[1].trigger();
      fixture.detectChanges();

      expect(spy).withContext('Expected initial trigger only').toHaveBeenCalledTimes(1);
    });
  });

  describe('when configured inline', () => {
    let fixture: ComponentFixture<InlineMenu>;
    let nativeMenu: HTMLElement;
    let nativeMenuItems: HTMLElement[];

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [InlineMenu],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(InlineMenu);
      fixture.detectChanges();

      nativeMenu = fixture.debugElement.query(By.directive(CdkMenu)).nativeElement;
      nativeMenuItems = fixture.debugElement
        .queryAll(By.directive(CdkMenuItem))
        .map(e => e.nativeElement);
    });

    it('should have its tabindex set to 0', () => {
      const item = fixture.debugElement.query(By.directive(CdkMenu)).nativeElement;
      expect(item.getAttribute('tabindex')).toBe('0');
    });

    it('should focus the first menu item when it gets tabbed in', () => {
      dispatchKeyboardEvent(document, 'keydown', TAB);
      nativeMenu.focus();

      expect(document.querySelector(':focus')).toEqual(nativeMenuItems[0]);
    });
  });

  describe('background click closeout', () => {
    let fixture: ComponentFixture<MenuBarWithMenusAndInlineMenu>;

    let popoutMenus: CdkMenu[];
    let triggers: CdkMenuItemTrigger[];
    let nativeInlineMenuItem: HTMLElement;

    /** open the attached menu. */
    function openMenu() {
      triggers[0].toggle();
      detectChanges();
    }

    /** set the menus and triggers arrays. */
    function grabElementsForTesting() {
      popoutMenus = fixture.componentInstance.menus.toArray().filter(el => !el._isInline());
      triggers = fixture.componentInstance.triggers.toArray();
      nativeInlineMenuItem = fixture.componentInstance.nativeInlineMenuItem.nativeElement;
    }

    /** run change detection and, extract and set the rendered elements. */
    function detectChanges() {
      fixture.detectChanges();
      grabElementsForTesting();
    }

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CdkMenuModule],
        declarations: [MenuBarWithMenusAndInlineMenu],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MenuBarWithMenusAndInlineMenu);
      detectChanges();
    });

    it('should close out all open menus when clicked outside the menu tree', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      dispatchMouseEvent(
        fixture.debugElement.query(By.css('#container')).nativeElement,
        'mousedown'
      );
      detectChanges();

      expect(popoutMenus.length).toBe(0);
    });

    it('should not close open menus when clicking on a menu group', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      const menuGroups = fixture.debugElement.queryAll(By.directive(CdkMenuGroup));
      menuGroups[2].nativeElement.click();
      detectChanges();

      expect(popoutMenus.length).toBe(1);
    });

    it('should not close open menus when clicking on a menu', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      fixture.debugElement.query(By.directive(CdkMenu)).nativeElement.click();
      detectChanges();

      expect(popoutMenus.length).toBe(1);
    });

    it('should not close open menus when clicking on a menu bar', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      fixture.debugElement.query(By.directive(CdkMenuBar)).nativeElement.click();
      detectChanges();

      expect(popoutMenus.length).toBe(1);
    });

    it('should not close when clicking on a CdkMenuItemCheckbox element', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      fixture.debugElement.query(By.directive(CdkMenuItemCheckbox)).nativeElement.click();
      fixture.detectChanges();

      expect(popoutMenus.length).toBe(1);
    });

    it('should not close when clicking on a non-menu element inside menu', () => {
      openMenu();
      expect(popoutMenus.length).toBe(1);

      fixture.debugElement.query(By.css('#inner-element')).nativeElement.click();
      detectChanges();

      expect(popoutMenus.length)
        .withContext('menu should stay open if clicking on an inner span element')
        .toBe(1);
    });

    it('should close the open menu when clicking on an inline menu item', () => {
      openMenu();

      dispatchMouseEvent(nativeInlineMenuItem, 'mousedown');
      detectChanges();

      expect(popoutMenus.length).toBe(0);
    });
  });
});

@Component({
  template: `
    <div cdkMenuBar>
      <button cdkMenuItem [cdkMenuTriggerFor]="panel"></button>
    </div>
    <ng-template cdkMenuPanel #panel="cdkMenuPanel">
      <ul cdkMenu [cdkMenuPanel]="panel">
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
    </ng-template>
  `,
})
class MenuCheckboxGroup {
  @ViewChild(CdkMenuItem) readonly trigger: CdkMenuItem;
  @ViewChild(CdkMenuPanel) readonly panel: CdkMenuPanel;
}

@Component({
  template: `
    <div cdkMenuBar>
      <button cdkMenuItem [cdkMenuTriggerFor]="panel"></button>
    </div>
    <ng-template cdkMenuPanel #panel="cdkMenuPanel">
      <ul cdkMenu [cdkMenuPanel]="panel">
        <li>
          <ul cdkMenuGroup>
            <li><button cdkMenuCheckbox>first</button></li>
          </ul>
        </li>
      </ul>
    </ng-template>
  `,
})
class MenuWithNestedGroup {
  @ViewChild(CdkMenuItem) readonly trigger: CdkMenuItem;
  @ViewChild(CdkMenuPanel) readonly panel: CdkMenuPanel;
}

@Component({
  template: `
    <div cdkMenuBar>
      <button cdkMenuItem [cdkMenuTriggerFor]="panel"></button>
    </div>
    <ng-template cdkMenuPanel #panel="cdkMenuPanel">
      <ul cdkMenu [cdkMenuPanel]="panel">
        <li><button cdkMenuItemCheckbox>first</button></li>
        <div *ngIf="renderInnerGroup">
          <ul cdkMenuGroup>
            <li><button cdkMenuItemCheckbox>second</button></li>
          </ul>
        </div>
      </ul>
    </ng-template>
  `,
})
class MenuWithConditionalGroup {
  renderInnerGroup = false;
  @ViewChild(CdkMenuItem) readonly trigger: CdkMenuItem;
  @ViewChild(CdkMenuPanel) readonly panel: CdkMenuPanel;
}

@Component({
  template: `
    <div cdkMenu>
      <button cdkMenuItem>Inbox</button>
      <button cdkMenuItem>Starred</button>
    </div>
  `,
})
class InlineMenu {}

@Component({
  template: `
    <div id="container">
      <div cdkMenuBar>
        <button cdkMenuItem [cdkMenuTriggerFor]="sub1">Trigger</button>
      </div>

      <ng-template cdkMenuPanel #sub1="cdkMenuPanel">
        <div cdkMenu [cdkMenuPanel]="sub1">
          <div cdkMenuGroup>
            <button cdkMenuItemCheckbox>Trigger</button>
            <span id="inner-element">A nested non-menuitem element</span>
          </div>
        </div>
      </ng-template>
    </div>

    <div cdkMenu>
      <button #inline_menu_item cdkMenuItem></button>
    </div>
  `,
})
class MenuBarWithMenusAndInlineMenu {
  @ViewChildren(CdkMenu) menus: QueryList<CdkMenu>;

  @ViewChildren(CdkMenuItemTrigger) triggers: QueryList<CdkMenuItemTrigger>;

  @ViewChild('inline_menu_item') nativeInlineMenuItem: ElementRef<HTMLButtonElement>;
}
