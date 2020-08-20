The `@angular/cdk-experimental/menu` module provides you with a way to easily create complex menu interfaces with support for:

- Standalone Menus
- Menubars
- Context Menus
- Inline Menus
- MenuItems
- RadioButtonItems
- CheckboxItems

`@angular/cdk-experimental/menu` can also intelligently predict if a user is attempting to navigate to an open submenu and prevent premature closeouts.

By using `@angular/cdk-experimental/menu` you get all the expected behaviors following aria best practices along with consideration for left-to-right and right-to-left layouts, and accessible interaction patterns.

### Getting started

Start by importing the `CdkMenuModule` into the `NgModule` where you want to create menus. You can now add the various directives in order to build out your menu. A basic standalone menu consists of the following directives:

- `cdkMenuItem` - added to the button itself
- `cdkMenuTriggerFor` - links a trigger button to a menu you intend to open
- `cdkMenuPanel` - wraps the menu and provides a link between the `cdkMenuTriggerFor` and the `cdkMenu`
- `cdkMenu` - the actual menu you want to open

<!-- TODO basic standalone menu example (like mat-menu has) -->

Keep in mind that there are two important requirements:

First, a triggering component or a component inside of a `CdkMenu` or `CdkMenuBar` must have the `cdkMenuItem` directive like so,

```html
<button cdkMenuItem [cdkMenuTriggerFor]="menu">Click me!</button>
```

```html
<div cdkMenu>
  <button cdkMenuItem>Click me!</button>
</div>
```

Second, non-inline menus must be wrapped in an `ng-template` which must have a directive of `cdkMenuPanel` and a reference variable must be of type `cdkMenuPanel`. Further, the `cdkMenu` must also reference the `cdkMenuPanel`.

```html
<ng-template cdkMenuPanel #panel="cdkMenuPanel">
  <div cdkMenu [cdkMenuPanel]="panel">
    <!-- some content -->
  </div>
</ng-template>
```

### Standalone Menus

A standalone menu is a menu which is triggered from a single standalone button. An opened menu may be layed out vertically (default) or horizontally and your styling should match the given orientation. If the orientation does not match the styling it will result in poor keyboard navigation.

<!-- TODO standalone trigger example (use from above?) -->

### MenuBars

A menubar interaction pattern follows the [aria menubar][1] spec and operates similar to a desktop app menubar. It consists of at least one `CdkMenuItem` which triggers a submenu. A menubar can be layed out horizontally or vertically (defaulting to horizontal). If the layout is changed the `orientation` attribute must be set in order for the keyboard navigation to work properly and for menus to open up in the correct location.

The main difference between a menubar and a standalone menu is the menubar groups together the triggering components. Therefore, menus in a menubar can be opened/closed on hover between their triggers and keyboard navigation listens to left and right arrow buttons which toggles between the menu items.

<!-- TODO basic menubar example (google docs?) -->

### Context Menus

A context menu is a menu which opens on a right click which occurs within some context. A context is an area of your application which contains some type of content where you want to open up a context menu. When a user right-clicks within the given context the associated menu opens up next to their cursor - as you would expect with a typical right click menu.

<!-- TODO basic context menu example -->

Context menu triggers may be nested within other context and when a user right clicks the deepest context menu is opened up.

```html
<div [cdkContextMenuTriggerFor]="outer">
  My outer context
  <div [cdkContextMenuTriggerFor]="inner">
    My inner context
  </div>
</div>
```

In the example above, right clicking on "My inner context" will open up the "inner" menu.

### Inline Menus

Inline menus are groups of menu items which typically do not trigger their own menus - the menu items implement some type of on-click behavior. The benefit of using an inline menu over a group of standalone menu triggers is the inline menu provides keyboard navigation and focus management. Menu items within an inline menus are logically grouped together.

<!-- TODO inline menu example -->

### Menuitem

Components which interact with or are placed inside of a menu or menubar should typically have the `cdkMenuItem` directive provided. This directive allows the items to be navigated to via keyboard interaction.

A menuitem by itself can provide some user defined action by hooking into the `cdkMenuItemTriggered` output. An example may be a close button which performs some closing logic.

```html
<ng-template cdkMenuPanel #panel="cdkMenuPanel">
  <div cdkMenu [cdkMenuPanel]="panel">
    <button cdkMenuItem [cdkMenuItemTriggered]="closeApp()"></button>
  </div>
</ng-template>
```

A menuitem should also be added to a component which triggers a menu or submenu.

```html
<ng-template cdkMenuPanel #panel="cdkMenuPanel">
  <div cdkMenu [cdkMenuPanel]="panel">
    <button cdkMenuItem [cdkMenuTriggerFor]="submenu"></button>
  </div>
</ng-template>
```

A menuitem also has two sub-types:

- CdkMenuItemCheckbox
- CdkMenuItemRadio

Neither of which should trigger a menu.

#### Menuitemcheckbox

A component with the `cdkMenuItemCheckbox` behaves just as you would expect a typical checkbox to behave. A use case may be toggling an independent setting since it contains a checked state. A component with the `cdkMenuItemCheckbox` directive does not need the additional `cdkMenuItem` directive.

#### Menuitemradio

A `cdkMenuItemRadio` behaves as you would expect a radio button to behave. A use case may be toggling through more than one state since radio buttons can be grouped together. A component with the `cdkMenuItemRadio` directive does not need the additional `cdkMenuItem` directive.

#### Groups

By default `cdkMenu` acts as a group for `cdkMenuItemRadio` elements. That is, components marked with `cdkMenuItemRadio` added as children of a `cdkMenu` will be logically grouped and only a single component can have the checked state.

If you would like to have disparate groups of radio buttons within a single menu you should use the `cdkMenuGroup` directive.

```html
<ng-template cdkMenuPanel #panel="cdkMenuPanel">
  <div cdkMenu [cdkMenuPanel]="panel">
    <div cdkMenuGroup>
      <button cdkMenuItemRadio>Small</button>
      <button cdkMenuItemRadio>Medium</button>
      <button cdkMenuItemRadio>Large</button>
    </div>
    <div cdkMenuGroup>
      <button cdkMenuItemRadio>Left</button>
      <button cdkMenuItemRadio>Center</button>
      <button cdkMenuItemRadio>Right</button>
    </div>
  </div>
</ng-template>
```

<!-- TODO standalone menu example with checkboxes and grouped radios -->

### Accessability

The set of directives follow accessability best practices as defined in the [aria spec][1]. Specifically, the menus are aware of left-to-right and right-to-left layouts and open appropriately however it is up to you to handle any related styling. Further, screen readers are supported however you should add `aria-label` or `aria-labelledby` if menu items do not have text. Finally, keyboard interaction is supported as defined in the [aria menubar keyboard interaction spec][2].

<!-- links -->

[1]: https://www.w3.org/TR/wai-aria-practices-1.1/#menu 'Aria Menubar Pattern'
[2]: https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-12 'Aria Menubar Keyboard Interaction'
