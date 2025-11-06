# Header Component Specification

## ADDED Requirements

### Requirement: Responsive Header Layout
The header SHALL implement a three-zone layout that adapts between desktop and mobile viewports.

#### Scenario: Desktop layout (≥768px)
- **WHEN** viewport width is 768px or greater
- **THEN** header displays logo on the left, navigation menu in the center, and actions (search, cart, account) on the right
- **AND** navigation links are displayed horizontally in a row
- **AND** logo uses theme settings image OR falls back to store name

#### Scenario: Mobile layout (<768px)
- **WHEN** viewport width is less than 768px
- **THEN** header displays hamburger menu on the left, logo in the center, and icons (search, cart) on the right
- **AND** navigation links are hidden in a slide-out drawer
- **AND** logo is centered for visual balance

### Requirement: Logo Display
The header SHALL display either a custom logo image or the store name.

#### Scenario: Logo image configured
- **WHEN** merchant has uploaded a logo in theme settings
- **THEN** display the logo image with configurable max-width
- **AND** apply alt text as store name for accessibility
- **AND** logo links to homepage

#### Scenario: No logo image configured
- **WHEN** no logo image is uploaded in theme settings
- **THEN** display store name as text
- **AND** use theme's heading font and primary color
- **AND** text links to homepage

### Requirement: Main Navigation Menu
The header SHALL render navigation links from the configured Shopify linklist.

#### Scenario: Desktop navigation display
- **WHEN** viewport is desktop size (≥768px)
- **THEN** display all links from `linklists.main-menu` horizontally
- **AND** apply hover states with smooth transitions
- **AND** maintain keyboard navigation support (Tab, Enter)

#### Scenario: Mobile navigation drawer
- **WHEN** viewport is mobile size (<768px)
- **AND** user clicks hamburger menu button
- **THEN** slide-out drawer appears from the left
- **AND** drawer contains all navigation links vertically
- **AND** body scroll is prevented while drawer is open
- **AND** focus is trapped within the drawer

#### Scenario: Navigation drawer close
- **WHEN** mobile navigation drawer is open
- **AND** user clicks backdrop OR clicks close button OR presses ESC key
- **THEN** drawer slides out and closes
- **AND** focus returns to hamburger menu button
- **AND** body scroll is restored

### Requirement: Search Functionality
The header SHALL provide search access through an icon that opens a search modal.

#### Scenario: Search modal open
- **WHEN** user clicks search icon
- **THEN** search modal appears as an overlay
- **AND** focus moves to search input field
- **AND** modal uses native `<dialog>` element
- **AND** body scroll is prevented

#### Scenario: Search modal close
- **WHEN** search modal is open
- **AND** user clicks backdrop OR presses ESC key
- **THEN** modal closes
- **AND** focus returns to search icon button

#### Scenario: Search submission
- **WHEN** user enters search query
- **AND** submits form (Enter key or submit button)
- **THEN** user is redirected to search results page
- **AND** search query is passed as URL parameter

### Requirement: Shopping Cart Display
The header SHALL display a cart icon with the current item count badge.

#### Scenario: Cart count display
- **WHEN** header loads
- **THEN** cart icon displays current item count from `cart.item_count`
- **AND** count badge is visible when count > 0
- **AND** count badge is hidden when count = 0

#### Scenario: Cart count update
- **WHEN** `cart:updated` event is dispatched
- **THEN** cart count badge updates with new item count
- **AND** update happens without page reload
- **AND** brief animation indicates the change

#### Scenario: Cart icon click
- **WHEN** user clicks cart icon
- **THEN** user is navigated to cart page
- **AND** OR cart drawer opens (if cart drawer feature exists)

### Requirement: Customer Account Access
The header SHALL display an account/login icon when customer accounts are enabled.

#### Scenario: Account icon display (accounts enabled)
- **WHEN** `shop.customer_accounts_enabled` is true
- **THEN** display account icon in header actions
- **AND** icon shows user profile outline

#### Scenario: Account icon click (logged out)
- **WHEN** customer is not logged in
- **AND** user clicks account icon
- **THEN** user is navigated to login page

#### Scenario: Account icon click (logged in)
- **WHEN** customer is logged in
- **AND** user clicks account icon
- **THEN** user is navigated to account dashboard

#### Scenario: Account icon hidden
- **WHEN** `shop.customer_accounts_enabled` is false
- **THEN** account icon is not rendered

### Requirement: Sticky Header Behavior
The header SHALL implement sticky positioning with smart show/hide on scroll.

#### Scenario: Header becomes sticky
- **WHEN** user scrolls down past 100px
- **THEN** header gains sticky positioning at top of viewport
- **AND** subtle shadow appears for visual separation
- **AND** background may gain slight opacity (configurable)

#### Scenario: Hide on scroll down
- **WHEN** user scrolls down more than 200px
- **THEN** header slides up out of view
- **AND** transform uses hardware-accelerated animation

#### Scenario: Show on scroll up
- **WHEN** user scrolls up at any position
- **THEN** header slides down into view
- **AND** remains accessible for navigation

#### Scenario: Sticky disabled
- **WHEN** merchant disables sticky header in theme settings
- **THEN** header remains in static position
- **AND** does not hide/show on scroll

### Requirement: Theme Editor Configuration
The header SHALL provide merchant-configurable settings through the theme editor.

#### Scenario: Logo settings
- **WHEN** merchant accesses header section settings
- **THEN** provide image_picker for logo upload
- **AND** provide range input for logo max-width (50-300px)

#### Scenario: Sticky header settings
- **WHEN** merchant accesses header section settings
- **THEN** provide checkbox to enable/disable sticky header
- **AND** provide checkbox to enable/disable hide-on-scroll behavior

#### Scenario: Style settings
- **WHEN** merchant accesses header section settings
- **THEN** provide color_picker for background color
- **AND** provide range for background opacity (0-100%)
- **AND** provide select for header height (compact/normal/tall)

#### Scenario: Navigation settings
- **WHEN** merchant accesses header section settings
- **THEN** provide link_list selector for main menu
- **AND** provide checkbox for showing search
- **AND** settings changes preview in real-time

### Requirement: Accessibility Compliance
The header SHALL meet WCAG 2.1 AA accessibility standards.

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard only
- **THEN** all interactive elements are reachable via Tab key
- **AND** visual focus indicators are clearly visible
- **AND** navigation links activate on Enter key
- **AND** mobile drawer closes on ESC key

#### Scenario: Screen reader support
- **WHEN** user navigates with screen reader
- **THEN** header has appropriate `<nav>` landmark role
- **AND** icon-only buttons have `aria-label` attributes
- **AND** cart count is announced as "X items in cart"
- **AND** mobile menu state is announced (expanded/collapsed)

#### Scenario: Touch target sizing
- **WHEN** user interacts on mobile device
- **THEN** all buttons have minimum 44x44px touch targets
- **AND** adequate spacing prevents accidental taps

#### Scenario: Color contrast
- **WHEN** header renders with any theme colors
- **THEN** text maintains 4.5:1 contrast ratio minimum
- **AND** icon colors meet 3:1 contrast for non-text elements

### Requirement: Performance Optimization
The header SHALL maintain excellent performance across all devices.

#### Scenario: Initial load performance
- **WHEN** page loads
- **THEN** header CSS is under 5KB (gzipped)
- **AND** header JavaScript is under 3KB (gzipped)
- **AND** no layout shift occurs during header render

#### Scenario: Animation performance
- **WHEN** mobile drawer animates open/close
- **THEN** animation uses CSS transforms (hardware-accelerated)
- **AND** animation maintains 60fps on mid-range devices
- **AND** animation respects `prefers-reduced-motion`

#### Scenario: Scroll performance
- **WHEN** user scrolls page with sticky header
- **THEN** scroll event handlers are throttled
- **AND** sticky positioning uses CSS (not JavaScript)
- **AND** no forced reflows occur

### Requirement: Internationalization Support
The header SHALL support multiple languages through Shopify's localization system.

#### Scenario: Translated UI text
- **WHEN** theme language is changed
- **THEN** all button labels use translation keys (e.g., `header.menu`, `header.search`, `header.cart`)
- **AND** aria-labels are localized
- **AND** tooltip text (if any) is localized

#### Scenario: RTL language support
- **WHEN** theme uses RTL language (Arabic, Hebrew)
- **THEN** header layout mirrors appropriately
- **AND** slide-out drawer animates from right instead of left
- **AND** icon directions reverse where appropriate

