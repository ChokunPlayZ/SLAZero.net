# SLAZero.net Project Structure

## Overview
This project follows a conventional web application structure with proper separation of concerns.

## Directory Structure

```
/
├── src/                          # Source code (website files)
│   ├── assets/                   # Static assets
│   │   ├── css/                  # Stylesheets
│   │   │   └── styles.css        # Main stylesheet with dark mode support
│   │   ├── js/                   # JavaScript files
│   │   │   ├── script.js         # Main JavaScript functionality
│   │   │   ├── i18n.js           # Internationalization system
│   │   │   └── blog-i18n.js      # Blog-specific translations
│   │   └── images/               # Image assets (for future use)
│   ├── pages/                    # Additional pages
│   │   ├── blog.html             # Blog page
│   │   ├── 404.html              # Custom 404 error page
│   │   └── 500.html              # Custom 500 error page
│   └── index.html                # Main homepage
├── docker/                       # Docker-related configuration
│   └── nginx.conf                # Nginx server configuration
├── scripts/                      # Build and deployment scripts
│   └── start.sh                  # Startup script
├── docs/                         # Documentation
│   ├── README.md                 # Main project documentation
│   └── PROJECT_STRUCTURE.md      # This file
├── Dockerfile                    # Docker container definition
├── docker-compose.yml            # Docker Compose configuration
├── .dockerignore                 # Docker ignore file
└── .git/                         # Git repository data
```

## Key Features

### Multi-Language Support
- English (default)
- Thai (ไทย)
- Japanese (日本語)

### Theme Support
- Light mode
- Dark mode with smooth transitions
- Firefox-specific "flashbang" easter egg

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Optimized for all screen sizes

### Docker Support
- Production-ready Nginx container
- Optimized for deployment
- Health checks and proper error handling

## Development

### Local Development
1. Navigate to the project root
2. Start a local server: `python3 -m http.server 3000`
3. Open `http://localhost:3000/src/`

### Docker Development
1. Build and run: `docker-compose up --build`
2. Access at `http://localhost:8080`

## File Paths
All paths are relative to the `src/` directory when served by the web server.

- CSS: `/assets/css/styles.css`
- JS: `/assets/js/*.js`
- Pages: `/pages/*.html`
- Main: `/index.html`
