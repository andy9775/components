import {InjectionToken, EventEmitter} from '@angular/core';

/** Injection token used to inject an implementor of the Menu interface */
export const MENU_INJECTION_KEY = new InjectionToken('cdk-menu');

/**
 * Menu interface to be used by CdkMenu and CdkMenuBar in order to eliminate circular dependencies
 */
export interface Menu {
  orientation: 'horizontal' | 'vertical';
  closed?: EventEmitter<void | 'click' | 'tab' | 'escape'>;
}
