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
  EventEmitter,
  QueryList,
  ContentChildren,
  AfterContentInit,
} from '@angular/core';
import {CdkMenuGroup} from './menu-group';

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
  providers: [{provide: CdkMenuGroup, useExisting: CdkMenu}],
})
export class CdkMenu extends CdkMenuGroup implements AfterContentInit {
  /**
   * Sets the aria-orientation attribute and determines where sub-menus will be opened.
   * Does not affect styling/layout.
   */
  @Input('cdkMenuOrientation') orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Event emitted when the menu is closed. */
  @Output() readonly closed: EventEmitter<void | 'click' | 'tab' | 'escape'> = new EventEmitter();

  /** List of nested CdkMenuGroup elements */
  @ContentChildren(CdkMenuGroup, {descendants: true})
  private readonly _nestedGroups: QueryList<CdkMenuGroup>;

  ngAfterContentInit() {
    super.ngAfterContentInit();

    // If there are nested MenuGroup elements within this group
    // we complete the change emitter in order to ensure that
    // the this menu does not emit change events.
    if (this._hasNestedGroups()) {
      this.change.complete();
    }

    this._nestedGroups.changes.subscribe(() => {
      if (!this.change.isStopped) {
        this.change.complete();
      }
    });
  }

  /** Return true if there are nested CdkMenuGroup elements within the Menu */
  private _hasNestedGroups() {
    return this._nestedGroups.length > 0;
  }
}
