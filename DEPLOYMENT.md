# Deployment Guide

This document provides instructions for deploying Survivors-Like to various platforms.

## Local Development

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Running Locally

#### Option 1: Simple File Server
1. Clone or download the repository
2. Navigate to the project directory
3. Open `index.html` directly in your browser

**Note**: Some features may not work properly due to CORS restrictions when opening files directly.

#### Option 2: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 3: Node.js Live Server
```bash
# Install live-server globally
npm install -g live-server

# Run in project directory
live-server --port=8000
```

#### Option 4: Using package.json scripts
```bash
# If you have Python installed
npm run start

# Or for Python 3
npm run serve
```

## Static Hosting Platforms

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `master`)
4. Your game will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your project folder to Netlify dashboard
3. Or connect your GitHub repository for automatic deployments
4. Your game will be available at a generated URL

### Vercel
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with default settings
4. Your game will be available at a generated URL

### Surge.sh
```bash
# Install surge globally
npm install -g surge

# Deploy from project directory
surge
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## Server Requirements

### Minimum Requirements
- Static file serving capability
- Support for HTML5, CSS3, and modern JavaScript
- HTTPS recommended for best performance

### Recommended Server Configuration
- Enable gzip compression for better performance
- Set appropriate cache headers for static assets
- Ensure proper MIME types for `.js` and `.css` files

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/survivors-like;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Performance Optimization

### Before Deployment
1. Test the game in different browsers
2. Verify responsive design on various screen sizes
3. Check console for any JavaScript errors
4. Test all game features and character classes

### Production Optimizations
- Consider minifying JavaScript and CSS files
- Optimize images if any are added
- Enable browser caching
- Use a CDN for better global performance

## Browser Compatibility

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Required Features
- HTML5 Canvas support
- ES6 JavaScript features
- CSS Grid and Flexbox
- Local Storage API

## Troubleshooting

### Common Issues
1. **Game not loading**: Check browser console for errors
2. **Performance issues**: Try reducing enemy count or effects
3. **Mobile responsiveness**: Test on actual devices
4. **Audio issues**: Ensure proper MIME types if audio is added

### Debug Mode
The game includes console logging for debugging. Open browser developer tools to see detailed information about game state and events.

## Security Considerations

### Content Security Policy
If implementing CSP headers, ensure they allow:
- Inline styles and scripts (or use nonces)
- Google Fonts if used
- Local storage access

### HTTPS
Always serve the game over HTTPS in production for:
- Better security
- Access to modern web APIs
- Improved SEO and performance 