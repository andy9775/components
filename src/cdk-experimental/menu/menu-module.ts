/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CdkMenu} from './menu';
import {CdkMenuBar} from './menu-bar';
import {CdkMenuPanel} from './menu-panel';
import {CdkMenuItem} from './menu-item';
import {CdkMenuGroup} from './menu-group';
import {OverlayModule} from '@angular/cdk/overlay';

const EXPORTED_DECLARATIONS = [CdkMenuBar, CdkMenu, CdkMenuPanel, CdkMenuItem, CdkMenuGroup];
@NgModule({
  imports: [OverlayModule],
  exports: EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS,
})
export class CdkMenuModule {}
