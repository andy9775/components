/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';
import {Directive, AfterContentInit} from '@angular/core';
import {CdkMenuItemSelectable} from './menu-item-selectable';

/**
 * A directive providing RadioButton functionality for the MenuBar/Menu. If the element this
 * directive is attached to is located within a Menu or MenuGroup, it's siblings are now part of the
 * same RadioGroup
 */
@Directive({
  selector: '[cdkMenuItemRadio]',
  exportAs: 'cdkMenuItemRadio',
  host: {
    '(click)': 'trigger()',
    'role': 'menuitemradio',
    '[attr.aria-checked]': 'checked',
  },
  providers: [{provide: CdkMenuItemSelectable, useExisting: CdkMenuItemRadio}],
})
export class CdkMenuItemRadio extends CdkMenuItemSelectable implements AfterContentInit {
  constructor(private readonly _selectionHandler: UniqueSelectionDispatcher) {
    super();
  }

  /** Configure event subscriptions */
  ngAfterContentInit() {
    this._selectionHandler.listen((id: string, name: string) => {
      if (this.id === id && this.name === name) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    });
  }

  trigger() {
    super.trigger();
    if (!this.disabled) {
      this._selectionHandler.notify(this.id, this.name);
    }
  }
}
