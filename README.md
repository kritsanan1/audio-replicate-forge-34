# Audio Forge - AI Voice Cloning Platform

<div align="center">
  <h3>🎤 Transform any voice into a digital replica with cutting-edge AI technology</h3>
  <p>A modern web application for voice cloning and text-to-speech synthesis</p>
  
  ![React](https://img.shields.io/badge/React-18.3.1-blue)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
  ![Vite](https://img.shields.io/badge/Vite-5.4.1-green)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.11-cyan)
  ![Supabase](https://img.shields.io/badge/Supabase-2.50.2-green)
</div>

---

## 🚀 Project Overview

Audio Forge is a cyberpunk-themed voice cloning platform that allows users to:

- **Clone Voices**: Upload audio samples and create high-fidelity voice replicas
- **Text-to-Speech**: Convert text into speech using cloned voices
- **Real-time Visualization**: Watch audio transform with live waveform displays
- **Professional Export**: Download studio-quality audio files

### 🎯 Key Features

- 🎨 **Cyberpunk UI**: Modern dark theme with neon accents
- 🔊 **Voice Cloning**: Advanced AI-powered voice replication
- 📊 **Audio Visualization**: Real-time waveform analysis
- 💾 **Cloud Storage**: Supabase integration for voice management
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎵 **Multiple Formats**: Support for various audio file types

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.1** - Fast build tool and development server
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Supabase Edge Functions** - Serverless API endpoints
- **React Query** - Server state management and caching

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization
- **Lucide React** - Beautiful icon library

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for dependencies
- **OS**: Windows 10+, macOS 10.15+, or Linux

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd audio-replicate-forge
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration (already configured in codebase)
VITE_SUPABASE_URL=https://tjncgwwcpqeytwvhutnm.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and monitoring
VITE_ANALYTICS_ID=your_analytics_id
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

---

## 🔧 Available Scripts

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start development server | Daily development work |
| `npm run build` | Build for production | Deployment preparation |
| `npm run build:dev` | Build with debug info | Staging environment |
| `npm run preview` | Preview production build | Final testing |
| `npm run lint` | Check code quality | Pre-commit validation |

For detailed script documentation, see [scripts.md](./scripts.md)

---

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AudioVisualizer.tsx    # Waveform visualization
│   ├── VoiceCloner.tsx        # Voice cloning interface
│   ├── TextToSpeech.tsx       # TTS interface
│   └── ui/                    # shadcn/ui components
├── pages/               # Application pages
├── hooks/               # Custom React hooks
├── integrations/        # External service configs
├── lib/                 # Utility libraries
└── assets/              # Static assets
```

For comprehensive structure analysis, see [filesExplainer.md](./filesExplainer.md)

---

## 🎨 Design System

Audio Forge uses a cyberpunk-inspired design system with:

### Color Palette
- **Primary**: `#ff0040` (Cyber Red)
- **Secondary**: `#ff4500` (Cyber Orange)  
- **Accent**: `#ffb000` (Cyber Amber)
- **Background**: `#0a0a0a` (Dark)
- **Surface**: `#1a1a1a` (Gray)

### Typography
- **Font**: JetBrains Mono (monospace)
- **Responsive scaling**: Mobile-first approach
- **Neon effects**: Text shadows and gradients

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glass morphism with subtle borders
- **Inputs**: Dark theme with neon focus states

---

## 🌐 Deployment

### Automatic Deployment (Recommended)
1. Visit [Lovable Project](https://lovable.dev/projects/54e181ab-0d20-429b-8906-a7422604f13f)
2. Click **Share** → **Publish**
3. Your app will be deployed automatically

### Manual Deployment

#### Build the Project
```bash
npm run build
```

#### Deploy to Vercel
```bash
npx vercel --prod
```

#### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Deploy to Traditional Hosting
Upload the `dist/` folder contents to your web server.

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Component and hook testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Full user journey testing

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- Follow **TypeScript** best practices
- Use **ESLint** configuration provided
- Write **meaningful commit messages**
- Add **tests** for new features
- Update **documentation** as needed

### Pull Request Guidelines
- Include description of changes
- Reference related issues
- Ensure all tests pass
- Update documentation if needed

---

## 📚 Documentation

- **[File Structure](./filesExplainer.md)** - Detailed project organization
- **[Scripts Guide](./scripts.md)** - NPM script documentation
- **[Architecture](./architecture.svg)** - System architecture diagram
- **[Structure Recommendations](./structure-recommendations.md)** - Optimization suggestions

---

## 🔒 Environment Configuration

### Supabase Setup
The project is pre-configured with Supabase. For custom setup:

1. Create a Supabase project
2. Update `src/integrations/supabase/client.ts`
3. Configure database tables
4. Set up edge functions

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Optional
VITE_APP_TITLE=Audio Forge
VITE_APP_DESCRIPTION=AI Voice Cloning Platform
```

---

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build fails with TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
npm run lint
```

**Supabase connection issues**
- Verify environment variables
- Check network connectivity
- Confirm Supabase project status

### Performance Optimization
- Use React DevTools for component analysis
- Monitor bundle size with `npm run build`
- Optimize images and assets
- Implement code splitting for large features

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ Authors not liable

---

## 🙏 Acknowledgments

- **Lovable Platform** - AI-powered development environment
- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend infrastructure
- **Lucide** - Icon library
- **Tailwind CSS** - Styling framework

---

## 📞 Support

### Getting Help
- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Community**: Connect with other developers

### Contact Information
- **Project URL**: [Lovable Project](https://lovable.dev/projects/54e181ab-0d20-429b-8906-a7422604f13f)
- **Repository**: This GitHub repository
- **Documentation**: Available in the `/docs` folder

---

<div align="center">
  <p>Made with ❤️ using Lovable AI Platform</p>
  <p>© 2024 Audio Forge - Powered by cutting-edge AI technology</p>
</div>
