import Link from 'next/link';
import { 
  Home, 
  User, 
  Settings, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Instagram, 
  Facebook,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

const Footer = () => {
  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/services', label: 'Services', icon: Settings },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/contact-us', label: 'Contact Us', icon: Mail },
  ];

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/refund-policy', label: 'Refund Policy' },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
  ];

  const contactInfo = [
    { icon: MapPin, text: '123 Main Street, City, State 12345' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'info@example.com' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info & Quick Links */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Your Company
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Building amazing digital experiences with modern technology and innovative solutions.
              </p>
              <Badge variant="secondary" className="mb-4">
                Est. 2024
              </Badge>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2" asChild>
                        <Link href={link.href} className="flex items-center space-x-2">
                          <Icon size={16} />
                          <span>{link.label}</span>
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2" asChild>
                      <Link href={link.href} className="flex items-center space-x-2">
                        <ExternalLink size={14} />
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2" asChild>
                    <Link href="/help" className="flex items-center space-x-2">
                      <BookOpen size={14} />
                      <span className="text-sm">Help Center</span>
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2" asChild>
                    <Link href="/faq" className="flex items-center space-x-2">
                      <Settings size={14} />
                      <span className="text-sm">FAQ</span>
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground mb-3">Get in Touch</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <Icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{info.text}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-2">
              <Button className="w-full" asChild>
                <Link href="/contact-us">
                  <Mail size={16} className="mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-3">Follow Us</h4>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button key={social.href} variant="outline" size="sm" className="h-10" asChild>
                      <Link href={social.href} target="_blank" rel="noopener noreferrer">
                        <Icon size={16} className="mr-2" />
                        {social.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to get updates about our latest features and news.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" className="w-full">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Your Company Name. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Made with ❤️ in India
            </Badge>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sitemap" className="text-xs">
                  Sitemap
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/accessibility" className="text-xs">
                  Accessibility
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;