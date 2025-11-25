# Vijay Vishwakarma - Professional Portfolio Website

A modern, responsive portfolio website showcasing expertise in DevOps, Public Cloud Architecture (AWS, Azure, GCP), and AI Solutions.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations and transitions
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **SEO Optimized**: Meta tags, structured data, and semantic HTML for better search visibility
- **Interactive Elements**: Hover effects, smooth scrolling, and animated content
- **Comprehensive Sections**:
  - Hero section with social media links
  - About Me - Professional background and expertise
  - Skills - Technical capabilities with visual cards
  - Projects - Featured portfolio projects with tech stacks
  - Experience - Professional timeline with detailed achievements
  - Consulting Services - Available services
  - Contact - Multiple contact methods

## 🚀 Technologies Used

- **HTML5** - Semantic markup with structured data
- **CSS3** - Modern styling with Flexbox and Grid
- **Bootstrap 5** - Responsive framework
- **JavaScript** - Interactive features and animations
- **Material Icons** - Iconography
- **Google Fonts (Inter)** - Typography

## 📁 Project Structure

```
html/
├── index.html          # Main portfolio page
├── 404.html           # Custom 404 error page
├── 500.html           # Custom 500 error page
├── styles.css         # Standalone CSS file (optional)
└── README.md          # Documentation
```

## 🎨 Color Scheme

- **Primary**: #2563eb (Blue)
- **Secondary**: #1e40af (Dark Blue)
- **Accent**: #f59e0b (Orange/Gold)
- **Text Dark**: #1f2937 (Charcoal)
- **Text Light**: #6b7280 (Gray)
- **Background**: #f8fafc (Light Gray)

## 📱 Sections Overview

### 1. Navigation
- Fixed top navigation with smooth scroll
- Responsive mobile menu
- Active section highlighting

### 2. Hero Section
- Professional title and expertise
- Social media links (GitHub, LinkedIn, Twitter)
- Cloud platform logos (AWS, Azure, GCP)
- Animated background with grid pattern

### 3. About Me
- Comprehensive professional background
- Expertise in DevOps, Cloud, and AI
- Experience highlights
- Professional approach and values

### 4. Skills
- 6 skill categories with icons:
  - Cloud Platforms
  - DevOps & Automation
  - Security & Compliance
  - Data & Analytics
  - Containerization
  - Monitoring & Optimization

### 5. Projects
- 6 featured projects showcasing:
  - Multi-Cloud Infrastructure Automation
  - CI/CD Pipeline Automation
  - AI-Powered Infrastructure Monitoring
  - Zero-Trust Security Framework
  - Microservices Migration
  - Cloud Cost Optimization Platform
- Each project includes tech stack badges and GitHub links

### 6. Experience
- Professional timeline with 4 positions
- Detailed achievements and responsibilities
- Technology tags for each role
- Visual timeline with markers

### 7. Consulting Services
- Architecture consulting
- Cloud migration services
- DevOps implementation
- Cost optimization
- Training and support
- Ongoing maintenance

### 8. Contact
- Email, phone, and LinkedIn
- Social media integration
- Call-to-action button

## 🔧 Setup & Deployment

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/sharmavijay86/mevijay.git
cd mevijay/html
```

2. Open `index.html` in your browser:
```bash
open index.html
# or
python3 -m http.server 8000
```

3. Visit http://localhost:8000

### GitHub Pages Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Deploy portfolio website"
git push origin main
```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select branch: `main`
   - Select folder: `/html` or `/ (root)`
   - Click Save

3. Access your site at: `https://sharmavijay86.github.io/mevijay/`

### Custom Domain Setup

1. Add a `CNAME` file with your domain:
```bash
echo "mevijay.io" > CNAME
```

2. Configure DNS settings:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record: `sharmavijay86.github.io`

## 🎯 Customization

### Update Personal Information

1. **Meta Tags** (lines 4-14): Update description, keywords, and social URLs
2. **Hero Section** (lines 340-390): Modify name, title, and social links
3. **About Section** (lines 440-465): Update biography and expertise
4. **Projects** (lines 510-670): Add/modify project details
5. **Experience** (lines 675-850): Update work history
6. **Contact** (lines 975-1020): Update contact information

### Modify Styles

- Colors: Update CSS variables in `:root` section
- Fonts: Change Google Fonts import and font-family
- Animations: Adjust timing in `@keyframes` rules
- Spacing: Modify padding/margin values

### Add New Sections

1. Add HTML structure after existing section
2. Include fade-in animation class
3. Update navigation menu
4. Add corresponding CSS styles
5. Update smooth scroll observer

## 📈 SEO Features

- Meta tags for description and keywords
- Open Graph tags for social sharing
- Twitter Card support
- Structured Data (JSON-LD) for Person schema
- Semantic HTML5 elements
- Alt tags for images
- Fast loading with CDN resources

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast
- Responsive font sizing
- Focus indicators

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📝 License

© 2025 Vijay Vishwakarma. All rights reserved.

## 📧 Contact

- **Email**: vijay@mevijay.io
- **LinkedIn**: [linkedin.com/in/sharmavijay86](https://linkedin.com/in/sharmavijay86)
- **GitHub**: [github.com/sharmavijay86](https://github.com/sharmavijay86)
- **Twitter**: [@sharmavijay86](https://twitter.com/sharmavijay86)

## 🙏 Acknowledgments

- Bootstrap for responsive framework
- Google Fonts for typography
- Material Icons for iconography
- GitHub Pages for hosting

---

**Built with ❤️ by Vijay Vishwakarma**
