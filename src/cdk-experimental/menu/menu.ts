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
  Output,
  ContentChildren,
  QueryList,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {CdkMenuItem} from './menu-item';
import {CdkMenuGroup} from './menu-group';
import {Menu, MENU_INJECTION_KEY} from './menu-interface';

/**
 * Directive which configures the element as a Menu which should contain child elements marked as
 * CdkMenuItem or CdkMenuGroup. Sets the appropriate role and aria-attributes for a menu and
 * contains accessible keyboard and mouse handling logic.
 *
 * It also acts as a RadioGroup for elements marked with role `menuitemradio`.
 */
@Directive({
  selector: '[cdkMenu]',
  exportAs: 'cdkMenu',
  host: {
    'role': 'menu',
    '[attr.aria-orientation]': 'orientation',
  },
  providers: [
    {provide: CdkMenuGroup, useExisting: CdkMenu},
    {provide: MENU_INJECTION_KEY, useExisting: CdkMenu},
  ],
})
export class CdkMenu extends CdkMenuGroup implements Menu, OnDestroy {
  /**
   * Sets the aria-orientation attribute and determines where sub-menus will be opened.
   * Does not affect styling/layout.
   */
  @Input('cdkMenuOrientation') orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Event emitted when the menu is closed. */
  @Output() readonly closed: EventEmitter<void | 'click' | 'tab' | 'escape'> = new EventEmitter();

  /** All the child MenuItem components which this directive wraps including descendants */
  @ContentChildren(CdkMenuItem, {descendants: true})
  readonly _allItems: QueryList<CdkMenuItem>;

  /** Emit the closed event */
  ngOnDestroy() {
    this.closed.next();
    this.closed.complete();
  }
}
