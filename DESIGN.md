---
name: Canine Connection
colors:
  surface: '#f4fafd'
  surface-dim: '#d4dbdd'
  surface-bright: '#f4fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f7'
  surface-container: '#e8eff1'
  surface-container-high: '#e2e9ec'
  surface-container-highest: '#dde4e6'
  on-surface: '#161d1f'
  on-surface-variant: '#414751'
  inverse-surface: '#2b3234'
  inverse-on-surface: '#ebf2f4'
  outline: '#717783'
  outline-variant: '#c1c7d3'
  surface-tint: '#0060ac'
  primary: '#005da7'
  on-primary: '#ffffff'
  primary-container: '#2976c7'
  on-primary-container: '#fdfcff'
  inverse-primary: '#a4c9ff'
  secondary: '#835500'
  on-secondary: '#ffffff'
  secondary-container: '#feae2c'
  on-secondary-container: '#6b4500'
  tertiary: '#386800'
  on-tertiary: '#ffffff'
  tertiary-container: '#498300'
  on-tertiary-container: '#f9ffeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#ffddb4'
  secondary-fixed-dim: '#ffb955'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#a1fa49'
  tertiary-fixed-dim: '#87dc2c'
  on-tertiary-fixed: '#0e2000'
  on-tertiary-fixed-variant: '#2a5000'
  background: '#f4fafd'
  on-background: '#161d1f'
  surface-variant: '#dde4e6'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is built to evoke trust, joy, and reliability for pet owners and professional walkers. The brand personality is "The Reliable Best Friend"—warm and approachable yet organized and secure. 

The aesthetic blends **Modern Corporate** structure with **Soft Minimalism**. It prioritizes clarity and ease of use under various lighting conditions (essential for outdoor use). The UI utilizes heavy whitespace to reduce cognitive load, paired with vibrant accent colors to guide user action. High-quality photography of happy dogs should be framed in the signature rounded containers to reinforce the friendly atmosphere.

## Colors

This color palette is designed to be high-energy yet balanced:
- **WalkManager Blue (#4A90E2):** The primary driver for brand identity, used for key actions, navigation states, and professional headers. It represents trust and the sky.
- **Sunny Yellow (#F5A623):** Reserved for high-attention elements like scheduling, notifications, and "active walk" indicators. It brings a sense of warmth and energy.
- **Leafy Green (#7ED321):** Used for "success" states, completed walks, and health-related metrics. It anchors the app in the physical world of parks and nature.
- **Neutrals:** A deep charcoal (#2D3436) is used for text to maintain high legibility, while a very light grey (#FAFAFA) serves as the primary background to let colorful cards pop.

## Typography

The typography system uses a pairing of two rounded sans-serifs to maximize friendliness. **Quicksand** is used for headlines to provide a distinct, playful character. **Nunito Sans** is used for all body text and labels because its slightly more traditional proportions ensure readability during long reading sessions or while the user is on the move.

All headers should utilize a tighter letter spacing to maintain a cohesive "block" feel. Body text should remain generously spaced to ensure accessibility for walkers viewing screens in bright sunlight.

## Layout & Spacing

The design system utilizes a **8px soft grid** to ensure mathematical harmony between elements. 

- **Mobile:** A single-column fluid layout with 20px side margins. Cards should span the full width minus margins.
- **Tablet:** A 6-column grid with 24px gutters. Content is typically contained in a central well of 720px.
- **Desktop:** A 12-column fixed grid (max-width 1200px). 

Use "loose" vertical spacing (spacing-lg or xl) between major sections to emphasize the clean, airy brand feel. Group related items (like a dog's name and their breed) using spacing-xs or sm.

## Elevation & Depth

This design system uses **Ambient Shadows** to create a sense of approachability and soft depth. Avoid harsh, black shadows.

- **Level 0 (Flat):** Used for the main background surface.
- **Level 1 (Card):** A very soft, diffused shadow (Y: 4px, Blur: 20px, 5% Opacity Primary Color) used for resting cards.
- **Level 2 (Interactive):** Used for hovered elements or active buttons (Y: 8px, Blur: 24px, 10% Opacity Primary Color).
- **Level 3 (Overlay):** Used for modals and bottom sheets, featuring a significant blur (Y: 16px, Blur: 40px, 15% Opacity Neutral Color).

Transitions between these levels should be animated with a 200ms "Ease-Out" curve to feel responsive and "bouncy."

## Shapes

The shape language is defined by **large, friendly radii**. 
- Standard UI components (buttons, inputs) use a 0.5rem base radius.
- **Feature Cards:** Use `rounded-2xl` (1.5rem) to create a distinct, soft container that feels modern and safe.
- **Imagery:** All dog profile photos and map snapshots must use `rounded-2xl` or be fully circular.
- **Icon Enclosures:** Small status chips or icon backgrounds should be fully pill-shaped.

## Components

### Buttons
- **Primary:** WalkManager Blue background, white text. Large padding (16px 32px), bold Quicksand font.
- **Secondary:** Sunny Yellow background, deep charcoal text. Used for secondary CTAs like "Add Note."
- **Ghost:** Primary color border and text. Used for less critical actions.

### Cards
- White background with `rounded-2xl` corners and Level 1 elevation.
- Padding should be consistent at `spacing-lg` (24px).
- Internal content should be organized with clear vertical hierarchy.

### Input Fields
- Soft grey background with a 2px inset border that turns WalkManager Blue on focus.
- Labels sit above the field in `label-md` Nunito Sans.
- Use rounded corners matching the base `roundedness` (0.5rem).

### Status Chips
- Small, pill-shaped indicators.
- Example: "Walking" (Leafy Green background, dark green text), "Pending" (Sunny Yellow background, dark orange text).

### Navigation
- **Mobile Bottom Bar:** High-blur glassmorphism effect with active icons tinted in WalkManager Blue. 
- Icons should follow the Lucide-style: 2px stroke width, rounded caps, and open paths.

### Motion & Interaction
- Use "Spring" transitions for page entries.
- High-quality micro-copy (Pretext) should be used throughout: instead of "Submit," use "Let's Go!"; instead of "Error," use "Ruh-roh! Something went wrong."