# UDG Construction Submittal Template

A professional, interactive construction submittal template designed for modern construction project management. This template provides a streamlined workflow for creating, reviewing, and approving construction submittals with comprehensive tracking and approval processes.

## 🏗️ Features

### Core Functionality
- **Dual Mode Operation**: Single submittal or multiple submittals per package
- **Interactive Forms**: Dynamic form fields with auto-completion and validation
- **File Attachments**: Drag-and-drop file upload with preview capabilities
- **Professional Styling**: Print-ready design with corporate branding
- **Multi-Party Approval**: Structured approval workflow for all stakeholders

### Approval Workflow
- **Contractor Review**: Internal quality control and completeness verification
- **Structural Engineer**: Load calculations and structural adequacy review
- **MEP Engineer**: Mechanical, electrical, and plumbing coordination
- **Architect**: Design intent and aesthetic compliance review
- **Project Manager**: Final approval and project coordination

### Technical Features
- **TypeScript**: Type-safe development with modern ES6+ features
- **Responsive Design**: Mobile-friendly interface
- **Print Optimization**: Professional print layouts
- **File Management**: Secure file handling with size validation
- **Auto-numbering**: Intelligent submittal numbering system

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime (recommended) or Node.js 18+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UDGOK/submittals.git
   cd submittals
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or with npm
   npm install
   ```

3. **Start development server**
   ```bash
   bun run dev
   # or with npm
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📖 Usage

### Creating a Single Submittal
1. Click "Single Submittal" mode
2. Fill in project and contractor information
3. Complete submittal details (number, description, CSI division)
4. Attach relevant files using drag-and-drop or file picker
5. Use the approval workflow sections for review processes
6. Print or save as PDF when complete

### Managing Multiple Submittals
1. Switch to "Multiple Submittals" mode
2. Use "Add Submittal" to create multiple submittal entries
3. Each submittal gets its own approval workflow
4. Manage all submittals in a single package

### File Management
- **Supported formats**: PDF, images, documents, CAD files
- **Maximum size**: 10MB per file
- **Drag & drop**: Simply drag files onto the upload area
- **Preview**: Image files show thumbnail previews

## 🔧 Development

### Available Scripts
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run lint` - Run TypeScript and Biome linting
- `bun run format` - Format code with Biome
- `bun run preview` - Preview production build

### Project Structure
```
submittals/
├── src/
│   ├── main.ts          # Main TypeScript functionality
│   └── vite-env.d.ts    # TypeScript declarations
├── public/
│   └── _redirects       # Netlify redirects
├── index.html           # Main template file
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
├── biome.json          # Biome configuration
├── .prettierrc         # Prettier configuration
└── netlify.toml        # Netlify deployment config
```

### Technology Stack
- **Frontend**: HTML5, CSS3, TypeScript
- **Build Tool**: Vite
- **Code Quality**: ESLint, Biome, Prettier
- **Deployment**: Netlify-ready configuration

## 📋 CSI Divisions Supported
- **03** - Concrete
- **05** - Metals
- **06** - Wood, Plastics, and Composites
- **07** - Thermal and Moisture Protection
- **08** - Openings
- **09** - Finishes
- **10** - Specialties
- **11** - Equipment
- **21** - Fire Suppression
- **22** - Plumbing
- **23** - HVAC
- **26** - Electrical

## 🎨 Customization

### Branding
- Update company logo in `index.html`
- Modify color scheme in CSS custom properties
- Customize header and footer information

### Workflow
- Add/remove approval parties in `src/main.ts`
- Modify status options for each review stage
- Customize form fields and validation

## 📄 Print & Export

The template is optimized for printing and PDF generation:
- Professional layout with proper page breaks
- Form data preserved in print output
- Clean, readable formatting
- Company branding included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software owned by UDG. All rights reserved.

## 📞 Support

For technical support or questions:
- Create an issue in this repository
- Contact the development team
- Refer to the documentation above

---

**Built with ❤️ for modern construction project management**
