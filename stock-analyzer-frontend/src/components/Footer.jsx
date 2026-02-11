import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: 'Features', path: '/' },
      { name: 'Pricing', path: '/premium' },
      { name: 'API', path: '/api' },
      { name: 'Integrations', path: '/integrations' },
    ],
    Company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blogs' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    Resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Help Center', path: '/help' },
      { name: 'Community', path: '/community' },
      { name: 'Status', path: '/status' },
    ],
    Legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
      { name: 'Security', path: '/security' },
      { name: 'Cookies', path: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@stockey.com', label: 'Email' },
  ];

  return (
    <footer className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-t border-light-accent/20 dark:border-dark-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text bg-clip-text text-transparent">
                Stockey
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
              AI-powered stock market analysis for smarter investment decisions.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-light-card dark:bg-dark-bg hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-700 dark:text-dark-text" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-gray-900 dark:text-dark-text mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-light-button dark:hover:text-dark-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-light-accent/20 dark:border-dark-accent/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Stockey. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with ❤️ for investors</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
