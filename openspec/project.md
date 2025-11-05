# Project Context

## Purpose
Minimal Shopify theme template framework for quick project starts. Provides a clean, maintainable foundation for building DTC (Direct-to-Consumer) Shopify stores with modern development practices, automated CI/CD, and one-click visual style switching capabilities.

## Tech Stack

### Core Technologies
- **Shopify Theme 2.0 Architecture** - Online Store 2.0 with JSON templates and Sections Everywhere
- **Liquid** - Shopify's template language for dynamic content
- **Tailwind CSS 3.3+** - Utility-first CSS framework with JIT compilation
- **Vite 5+** - Fast build tool for development and production
- **PostCSS** - CSS processing with autoprefixer
- **Vanilla JavaScript (ES6+)** - No framework dependencies, native ES modules
- **Web Components** - Native browser custom elements (preferred for reusable components)

### Development Tools
- **Node.js 18+** - Runtime environment
- **npm** - Package manager
- **Shopify CLI** - Local development and theme management
- **GitHub Actions** - CI/CD automation

### Build & Optimization
- **Vite** - Asset bundling and minification
- **Tailwind CSS JIT** - On-demand CSS generation
- **ESBuild** - Fast JavaScript minification
- **PostCSS Autoprefixer** - Cross-browser compatibility

## Project Conventions

### Code Style

#### Liquid Templates
- Use Shopify Theme 2.0 architecture (`templates/index.json` pattern with Sections Everywhere)
- Follow Shopify Liquid best practices
- Use semantic HTML5 elements
- Prefer `{% render %}` over `{% include %}` for snippets
- Include schema blocks for all sections
- Use descriptive section/snippet names (kebab-case)

#### JavaScript
- ES6+ modules with `import`/`export`
- Prefer native Web Components over frameworks
- Use `data-*` attributes for DOM selection
- Follow async/await patterns for API calls
- Keep functions focused and single-purpose
- Use JSDoc comments for public functions

#### CSS
- Tailwind CSS utility classes (primary approach)
- Custom CSS only when utilities insufficient
- CSS custom properties (CSS variables) for theme values
- Mobile-first responsive design
- Use `@layer` directives for custom component styles

#### File Naming
- Liquid files: `kebab-case.liquid`
- JavaScript: `kebab-case.js`
- CSS: `kebab-case.css`
- Directories: `kebab-case/`

### Architecture Patterns

#### Theme Structure
```
/
├── layout/          # Layout templates (theme.liquid, password.liquid)
├── templates/       # Page templates (Theme 2.0 JSON format)
├── sections/       # Reusable theme sections
├── snippets/        # Reusable code fragments
├── assets/          # Compiled CSS/JS (generated)
├── config/          # Theme settings (settings_schema.json)
├── locales/         # Translation files
└── src/             # Source files (not deployed to Shopify)
    ├── css/         # Tailwind CSS source
    └── js/          # JavaScript modules
```

#### Design Token System
- Design decisions (colors, fonts, spacing) separated from HTML structure
- CSS custom properties for runtime theme switching
- Configuration-driven theming through `config/settings_schema.json`
- Theme presets for one-click visual style switching

#### Component Architecture
- **Liquid Components**: Sections and snippets for server-rendered content
- **Web Components**: Native custom elements for interactive functionality
- **JavaScript Modules**: ES6+ modules for shared functionality
- Clear separation: Structure (HTML/Liquid) vs. Behavior (JS) vs. Style (CSS)

#### Build Process
1. Source files (`src/`) → Vite build
2. Tailwind CSS compilation with JIT
3. JavaScript bundling and minification
4. Output to `assets/` directory
5. GitHub Actions auto-commits built assets

### Testing Strategy

#### Theme Validation
- **Shopify Theme Check** - Automated validation via `npm run lint`
- Zero errors required before deployment
- Validates Liquid syntax, schema compliance, and best practices

#### Manual Testing
- Test on multiple device sizes (mobile, tablet, desktop)
- Verify all page templates render correctly
- Test cart functionality and product interactions
- Validate navigation and responsive behavior

#### Performance Testing
- CSS bundle size: < 15KB (gzipped)
- JavaScript bundle size: < 5KB (gzipped)
- Lighthouse performance audits
- Core Web Vitals monitoring

### Git Workflow

#### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch (triggers CI/CD)
- Feature branches: `feature/description`
- Use conventional commit messages

#### CI/CD Pipeline (GitHub Actions)
- Triggered on push to `main` or `develop`
- Installs dependencies
- Builds assets (CSS/JS)
- Runs theme validation
- Auto-commits built assets (if changed)

#### Commit Conventions
- Use descriptive commit messages
- Reference issues/PRs when applicable
- Atomic commits (one logical change per commit)

## Domain Context

### Shopify Theme Development
- **Theme 2.0**: Online Store 2.0 architecture with JSON templates and Sections Everywhere
- **Sections**: Reusable blocks configurable in theme editor
- **Snippets**: Reusable Liquid fragments
- **Assets**: Static files (CSS, JS, images) served via CDN
- **Settings Schema**: JSON configuration for theme customization
- **Liquid**: Shopify's templating language with filters and tags

### DTC (Direct-to-Consumer) Requirements
- Fast load times for conversion optimization
- Mobile-first design (majority of traffic)
- Brand customization without code changes
- Theme switching capability for multi-brand scenarios
- SEO-friendly structure
- Accessibility compliance

### Performance Priorities
- Minimal bundle sizes (CSS < 15KB, JS < 5KB gzipped)
- Lazy loading for images
- Critical CSS inlining
- Tree-shaking unused code
- CDN delivery via Shopify

## Important Constraints

### Technical Constraints
- Must work with Shopify's serverless environment
- Build process must run in GitHub Actions (Node.js only)
- No server-side JavaScript execution
- Liquid templates must be valid Shopify syntax
- Asset files limited to Shopify's file size restrictions
- Theme must support Shopify Theme Check validation

### Design Constraints
- Must support Shopify Theme Editor customization
- Settings must be configurable without code changes
- Theme switching should not require HTML structure changes
- Must support Theme 2.0 features (Sections Everywhere, App Blocks)

### Business Constraints
- Quick setup time (< 15 minutes for new projects)
- Easy for non-technical users to customize
- Support for multiple brands/themes from single codebase
- Minimal maintenance overhead

## External Dependencies

### Shopify Services
- **Shopify Admin API** - Theme management and settings
- **Shopify CDN** - Asset delivery
- **Theme Editor** - Visual customization interface
- **GitHub Integration** - Automated theme deployment

### Third-Party Services
- **GitHub** - Version control and CI/CD
- **npm Registry** - Package dependencies

### Development Dependencies
- `@shopify/cli` - Local development server
- `tailwindcss` - CSS framework
- `vite` - Build tool
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing

## Key Design Principles

1. **Separation of Concerns**: Structure (HTML), Style (CSS), Behavior (JS)
2. **Design Token System**: Theme values abstracted from implementation
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Performance First**: Optimize for speed and bundle size
5. **Developer Experience**: Clear structure, good documentation, easy customization
6. **Maintainability**: Modular code, clear patterns, minimal complexity
7. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
8. **Web Standards**: Prefer native browser APIs over frameworks
