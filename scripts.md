# NPM Scripts Documentation

## Available Scripts

This document describes all available npm scripts in the Audio Forge project, their purposes, usage examples, and expected outputs.

---

## Development Scripts

### `npm run dev`
**Purpose**: Starts the development server with hot module replacement (HMR)

**Functionality**: 
- Launches Vite development server
- Enables hot reloading for instant updates
- Serves the application on localhost with auto-refresh
- Provides fast build times and instant feedback

**Usage**:
```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.4.1  ready in 543 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.100:8080/
  ➜  press h to show help
```

**Common Use Cases**:
- Daily development work
- Testing changes in real-time
- Component development and styling
- Debugging with browser dev tools

**Environment Variables**: None required for basic development

---

## Build Scripts

### `npm run build`
**Purpose**: Creates an optimized production build

**Functionality**:
- Compiles TypeScript to JavaScript
- Bundles and minifies all assets
- Optimizes images and static files
- Generates production-ready files in `dist/` directory

**Usage**:
```bash
npm run build
```

**Expected Output**:
```
vite v5.4.1 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-B2nXX8aX.css   12.34 kB │ gzip:  3.21 kB
dist/assets/index-C7H3fB9v.js   245.67 kB │ gzip: 78.45 kB
✓ built in 2.34s
```

**Common Use Cases**:
- Production deployment preparation
- Performance testing with optimized bundle
- Bundle size analysis
- CI/CD pipeline integration

**Required Environment Variables**:
- Supabase configuration (automatically included)

---

### `npm run build:dev`
**Purpose**: Creates a development build with debugging information

**Functionality**:
- Builds the application in development mode
- Preserves source maps and debugging info
- Faster build process than production
- Useful for staging environments

**Usage**:
```bash
npm run build:dev
```

**Expected Output**:
```
vite v5.4.1 building for development...
✓ 189 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-dev.css        15.23 kB
dist/assets/index-dev.js        567.89 kB
✓ built in 1.87s
```

**Common Use Cases**:
- Staging environment deployment
- Debug production-like builds
- Performance testing with source maps
- CI testing with faster builds

---

## Quality Assurance Scripts

### `npm run lint`
**Purpose**: Analyzes code for style issues and potential errors

**Functionality**:
- Runs ESLint on all TypeScript and TSX files
- Checks for code style violations
- Identifies potential bugs and anti-patterns
- Enforces consistent coding standards

**Usage**:
```bash
npm run lint
```

**Expected Output (No Issues)**:
```
✨ Clean! No ESLint errors or warnings.
```

**Expected Output (With Issues)**:
```
src/components/VoiceCloner.tsx
  15:7  warning  'unusedVariable' is defined but never used  @typescript-eslint/no-unused-vars
  23:12 error    Missing return type on function           @typescript-eslint/explicit-function-return-type

✖ 2 problems (1 error, 1 warning)
```

**Common Use Cases**:
- Pre-commit code quality checks
- Continuous integration quality gates
- Code review preparation
- Maintaining consistent code style

**Configuration Files**:
- `eslint.config.js` - Main ESLint configuration
- `.eslintrc.*` files are not used (flat config)

---

## Preview Scripts

### `npm run preview`
**Purpose**: Serves the production build locally for testing

**Functionality**:
- Serves the built application from `dist/` directory
- Simulates production environment locally
- Tests the actual production bundle
- Useful for final verification before deployment

**Usage**:
```bash
# First build the project
npm run build

# Then preview it
npm run preview
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
  ➜  press h to show help
```

**Common Use Cases**:
- Testing production builds locally
- Verifying build optimization results
- Final QA before deployment
- Troubleshooting production-specific issues

**Prerequisites**: 
- Must run `npm run build` first
- Requires `dist/` directory with built files

---

## Script Combinations and Workflows

### Development Workflow
```bash
# 1. Start development
npm run dev

# 2. Check code quality (in separate terminal)
npm run lint

# 3. Build and test production version
npm run build
npm run preview
```

### CI/CD Pipeline Workflow
```bash
# 1. Install dependencies
npm ci

# 2. Run quality checks
npm run lint

# 3. Build application
npm run build

# 4. Serve and test (optional)
npm run preview &
# Run integration tests here
```

### Deployment Preparation
```bash
# 1. Ensure clean code
npm run lint

# 2. Create optimized build
npm run build

# 3. Test production build
npm run preview

# 4. Deploy dist/ directory
```

---

## Performance Considerations

### Build Times
- **dev**: ~500ms initial, instant HMR updates
- **build:dev**: ~2-3 seconds
- **build**: ~3-5 seconds (includes optimization)
- **lint**: ~1-2 seconds

### Bundle Sizes (Approximate)
- **CSS**: ~12KB gzipped
- **JavaScript**: ~78KB gzipped
- **Assets**: Varies based on audio files and images

### Memory Usage
- **dev server**: ~150MB RAM
- **build process**: ~200MB RAM peak

---

## Troubleshooting

### Common Issues and Solutions

**Build Fails with TypeScript Errors**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type errors before building
npm run lint
```

**Dev Server Won't Start**:
```bash
# Check if port is in use
lsof -i :8080

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Lint Errors**:
```bash
# Auto-fix fixable issues
npx eslint --fix src/

# Check specific file
npx eslint src/components/VoiceCloner.tsx
```

**Build Size Too Large**:
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/
```

### Environment-Specific Scripts

**Windows Users**:
- All scripts work with `npm run` or `yarn`
- Use PowerShell or Command Prompt
- Git Bash also supported

**macOS/Linux Users**:
- All scripts work with `npm run` or `yarn`
- Use Terminal or any shell
- Can use `make` wrapper if created

**Docker Environment**:
```dockerfile
# Install dependencies
RUN npm ci

# Build application
RUN npm run build

# Serve application
CMD ["npm", "run", "preview"]
```