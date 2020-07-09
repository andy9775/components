/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  Inject,
  Self,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {_getShadowRoot} from '@angular/cdk/platform';
import {Subject} from 'rxjs';
import {CdkMenuGroup} from './menu-group';
import {CDK_MENU, Menu} from './menu-interface';
import {CdkMenuItem} from './menu-item';
import {MenuKeyManager, TYPE_AHEAD_DEBOUNCE} from './menu-key-manager';
import {MENU_STACK, MenuStack} from './menu-stack';

/**
 * Directive applied to an element which configures it as a MenuBar by setting the appropriate
 * role, aria attributes, and accessible keyboard and mouse handling logic. The component that
 * this directive is applied to should contain components marked with CdkMenuItem.
 *
 */
@Directive({
  selector: '[cdkMenuBar]',
  exportAs: 'cdkMenuBar',
  host: {
    '(keydown)': '_handleKeyEvent($event)',
    '(focus)': 'focusFirstItem()',
    'role': 'menubar',
    'tabindex': '0',
    '[attr.aria-orientation]': 'orientation',
  },
  providers: [
    {provide: CdkMenuGroup, useExisting: CdkMenuBar},
    {provide: CDK_MENU, useExisting: CdkMenuBar},
    {provide: MENU_STACK, useClass: MenuStack},
  ],
})
export class CdkMenuBar extends CdkMenuGroup implements Menu, OnDestroy, AfterContentInit {
  /**
   * Sets the aria-orientation attribute and determines where menus will be opened.
   * Does not affect styling/layout.
   */
  @Input('cdkMenuBarOrientation') orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** Handles keyboard events for the MenuBar. */
  private _menuKeyManager?: MenuKeyManager;

  /** All child MenuItem elements nested in this MenuBar. */
  @ContentChildren(CdkMenuItem, {descendants: true})
  private readonly _allItems: QueryList<CdkMenuItem>;

  constructor(
    private readonly _dir: Directionality,
    @Inject(TYPE_AHEAD_DEBOUNCE) private readonly _debounceInterval: number,
    @Self() @Inject(MENU_STACK) stack: MenuStack
  ) {
    super();
    console.log(stack.id);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this._menuKeyManager = new MenuKeyManager(
      this._allItems,
      this._dir,
      this.orientation,
      this._debounceInterval
    );
  }

  /** Place focus on the first MenuItem in the menu. */
  focusFirstItem() {
    if (this._menuKeyManager) {
      this._menuKeyManager.focusFirstItem();
    }
  }

  /** Place focus on the last MenuItem in the menu. */
  focusLastItem() {
    if (this._menuKeyManager) {
      this._menuKeyManager.focusLastItem();
    }
  }

  /** Place focus on the given MenuItem in the menu. */
  focusItem(child: CdkMenuItem) {
    if (this._menuKeyManager) {
      this._menuKeyManager.focusItem(child);
    }
  }

  /** Get an emitter which emits bubbled-up keyboard events from the keyboard manager. */
  _getBubbledKeyboardEvents(): Subject<KeyboardEvent> | null {
    if (this._menuKeyManager) {
      return this._menuKeyManager._bubbledEvents;
    }
    return null;
  }

  /** Direct the MenuKeyManager to handle the keyboard event. */
  _handleKeyEvent(event: KeyboardEvent) {
    if (this._menuKeyManager) {
      this._menuKeyManager.onKeydown(event);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this._menuKeyManager!.destroy();
  }
}
