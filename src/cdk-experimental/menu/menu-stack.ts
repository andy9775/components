import {CdkMenuPanel} from './menu-panel';
import {InjectionToken} from '@angular/core';

export const MENU_STACK = new InjectionToken('cdk-menu-stack');

let _id = 0;
export class MenuStack {
  static _mapping: Map<CdkMenuPanel, MenuStack> = new Map();

  id = _id++;
}
