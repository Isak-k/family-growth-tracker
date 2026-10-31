import { GraduationCap, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-40 h-40 border border-primary-foreground/30 rounded-full" />
            <div className="absolute bottom-10 right-20 w-60 h-60 border border-primary-foreground/20 rounded-full" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Guide Your Child's Future?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join hundreds of Ethiopian families already using EduFamily to track academic progress and make informed decisions.
            </p>
            <Link to="/signup">
              <Button size="xl" className="bg-background text-foreground hover:bg-background/90 font-semibold rounded-xl shadow-xl group">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer content */}
      <div className="bg-foreground text-background/80 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-background/10">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="font-display text-xl font-semibold text-background">EduFamily</span>
              </div>
              <p className="text-background/60 max-w-sm leading-relaxed">
                A private family-based application for tracking academic performance 
                and guiding Ethiopian university department selection.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-background">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'University Guidance', href: '/guidance' },
                  { label: 'Analytics', href: '/analytics' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-background/50 hover:text-background transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold mb-4 text-background">Languages</h4>
              <ul className="space-y-3 text-background/50 text-sm">
                <li>🇬🇧 English</li>
                <li>🇪🇹 Afaan Oromoo</li>
                <li>🇪🇹 አማርኛ (Amharic)</li>
                <li>🇸🇦 العربية (Arabic)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/40">
              © 2024 EduFamily. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-background/40">
              Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for Ethiopian families
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
