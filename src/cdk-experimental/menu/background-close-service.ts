/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, Inject, InjectionToken, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil, take} from 'rxjs/operators';
import {MenuStack} from './menu-stack';

/**
 * A function which dictates whether the background click event should cause the menu stack to close
 * out.
 */
export type ShouldCloseMenu = (target: Element | null) => boolean;
export const SHOULD_CLOSE_MENU = new InjectionToken('cdk-should-close-menu');

@Injectable({providedIn: 'root'})
export class BackgroundCloseService implements OnDestroy {
  private readonly _document: Document;

  /** A callback which determines if the menu stack should be closed out. */
  private _shouldCloseMenu?: ShouldCloseMenu;

  /** Emits when the background listener should stop listening. */
  private readonly _stopListener: Subject<void> = new Subject();

  /** The current open menu stack. */
  private _menuStack?: MenuStack;

  constructor(@Inject(DOCUMENT) document: any) {
    this._document = document;
  }

  startListener(shouldCloseMenu: ShouldCloseMenu, menuStack: MenuStack) {
    // Ensure that any other open menus are closed out when a new stack is started.
    // If the current menu stack and the new menu stack are the same we don't want to register
    // another listener or close out the current stack.
    if (this._menuStack !== menuStack) {
      this._closePreviousListener();

      this._setShouldCloseMenu(shouldCloseMenu);
      this._setMenuStack(menuStack);

      this._listenMenuClosed();

      this._startBackgroundListener();
    }
  }

  /** Close out the previous stack and stop the listener. */
  private _closePreviousListener() {
    this._menuStack?.closeAll();
    this._stopListener.next();
  }

  /** Set the ShouldCloseMenu callback function. */
  private _setShouldCloseMenu(shouldCloseMenu: ShouldCloseMenu) {
    this._shouldCloseMenu = shouldCloseMenu;
  }

  /** Set the menu stack. */
  private _setMenuStack(menuStack: MenuStack) {
    this._menuStack = menuStack;
  }

  /** When the menu stack closes, reset the BackgroundCloseService. */
  private _listenMenuClosed() {
    this._menuStack?.emptied.pipe(take(1)).subscribe(() => {
      this._resetState();
      this._stopBackgroundListener();
    });
  }

  /** Stops the background click listener and resets the menu stack and callback. */
  private _stopBackgroundListener() {
    this._stopListener.next();
  }

  /** Unset the menu stack and close handler callback. */
  private _resetState() {
    this._shouldCloseMenu = undefined;
    this._menuStack = undefined;
  }

  /**
   * Start listening the background click events and close out the menu stack if a click occurs on
   * a background element as determined by the provided `ShouldCloseMenu` callback.
   */
  private _startBackgroundListener() {
    fromEvent<MouseEvent>(this._document, 'mousedown')
      .pipe(takeUntil(this._stopListener))
      .subscribe(event => {
        const target = event.composedPath ? event.composedPath()[0] : event.target;
        if (target instanceof HTMLElement && this._shouldCloseMenu!(target)) {
          this._menuStack!.closeAll();
        }
      });
  }

  ngOnDestroy() {
    this._stopListener.next();
    this._stopListener.complete();
  }
}
