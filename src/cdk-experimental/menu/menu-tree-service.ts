/**
 * Track the open menu HTML elements in order to handle click events outside the menu tree.
 */
export class OpenMenuTracker {
  /** Array of the HTMLElements in the open menu tree starting from the root Menu Bar. */
  readonly openMenus: HTMLElement[] = [];

  /** Add a menus native element to the service. */
  push(menuElement: HTMLElement) {
    this.openMenus.push(menuElement);
  }

  /** Add the given given trackers open menu elements to this tracker. */
  extend(service: OpenMenuTracker) {
    this.openMenus.push(...service.openMenus);
  }
}
