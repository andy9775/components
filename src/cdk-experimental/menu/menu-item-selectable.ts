/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {coerceBooleanProperty, BooleanInput} from '@angular/cdk/coercion';
import {Input, Directive, Output, EventEmitter} from '@angular/core';
import {CdkMenuItem} from './menu-item';

let _uniqueNameCounter = 0;
let _uniqueIdCounter = 0;

/**
 * Base class providing checked state for MenuItems along with outputting a clicked event when the
 * element is triggered.
 */
@Directive()
export abstract class CdkMenuItemSelectable extends CdkMenuItem {
  /** Event emitted when the selectable item is clicked */
  @Output() clicked: EventEmitter<CdkMenuItemSelectable> = new EventEmitter();

  /** Whether the checkbox or radiobutton is checked */
  @Input()
  get checked() {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = coerceBooleanProperty(value);
  }
  private _checked = false;

  /** The name of the selectable element */
  @Input() name: string = `menu-item-radio-${_uniqueNameCounter++}`;

  /** The id of the selectable element */
  @Input() id: string = `menu-item-radio-${_uniqueIdCounter++}`;

  /** If the element is not disabled emit the click event */
  trigger() {
    if (!this.disabled) {
      this.clicked.next(this);
    }
  }

  static ngAcceptInputType_checked: BooleanInput;
}
