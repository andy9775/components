/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Throws an exception when a CdkMenuTrigger does not have a reference to a CdkMenuPanel.
 * @docs-private
 */
export function throwWrongTriggerError() {
  throw Error('Incorrect or missing CdkMenuPanel in CdkMenuTrigger');
}
