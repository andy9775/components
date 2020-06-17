/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Input, Output, EventEmitter, Self} from '@angular/core';
import {CdkMenuPanel} from './menu-panel';
import {CdkMenuItem} from './menu-item';

/**
 * A directive which opens a Menu which it is attached to. If the element is in a top level
 * MenuBar it will open the menu on click, or if a sibling is already opened it will open on hover.
 * If it is inside of a Menu it will open the attached Submenu on hover regardless of its sibling
 * state.
 */
@Directive({
  selector: '[cdkMenuTriggerFor]',
  exportAs: 'cdkMenuTrigger',
  host: {
    'aria-haspopup': 'menu',
  },
})
export class CdkMenuItemTrigger {
  /** Template reference variable to the menu this trigger opens */
  @Input('cdkMenuTriggerFor') _menuPanel: CdkMenuPanel;

  /** Emits when the attached submenu is opened */
  @Output() opened: EventEmitter<void> = new EventEmitter();

  constructor(@Self() _menuItemInstance: CdkMenuItem) {
    _menuItemInstance.hasSubmenu = true;
  }
}
