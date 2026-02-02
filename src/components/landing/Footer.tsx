import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-semibold text-primary">dot payments</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Docs</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2026 Dot Payments. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
