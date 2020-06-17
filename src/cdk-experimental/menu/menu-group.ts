/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Output,
  EventEmitter,
  ContentChildren,
  AfterContentInit,
  QueryList,
} from '@angular/core';
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';

import {CdkMenuItemSelectable} from './menu-item-selectable';
import {CdkMenuItem} from './menu-item';

/**
 * Directive which acts as a grouping container for `CdkMenuItem` instances with
 * `role="menuitemradio"`, similar to a `role="radiogroup"` element.
 */
@Directive({
  selector: '[cdkMenuGroup]',
  exportAs: 'cdkMenuGroup',
  host: {
    'role': 'group',
  },
  providers: [{provide: UniqueSelectionDispatcher, useClass: UniqueSelectionDispatcher}],
})
export class CdkMenuGroup implements AfterContentInit {
  /** Emits the element when checkbox or radiobutton state changed  */
  @Output() change: EventEmitter<CdkMenuItem> = new EventEmitter();

  /** List of menuitemcheckbox or menuitemradio elements which reside in this group */
  @ContentChildren(CdkMenuItemSelectable, {descendants: true})
  private readonly _selectableItems: QueryList<CdkMenuItemSelectable>;

  ngAfterContentInit() {
    this._selectableItems.forEach(selectable => this._registerClickListener(selectable));
    this._selectableItems.changes.subscribe(selectable => this._registerClickListener(selectable));
  }

  /** Register each selectable to emit on the change Emitter when clicked */
  private _registerClickListener(selectable: CdkMenuItemSelectable) {
    selectable.clicked.subscribe(() => this.change.next(selectable));
  }
}
