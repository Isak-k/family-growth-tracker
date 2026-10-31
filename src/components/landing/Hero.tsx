import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Sparkles, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Floating decorative elements */}
      <div className="absolute top-32 right-1/4 animate-float" style={{ animationDelay: '1s' }}>
        <div className="p-3 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 shadow-lg">
          <Star className="h-6 w-6 text-secondary" />
        </div>
      </div>
      <div className="absolute bottom-40 left-1/4 animate-float" style={{ animationDelay: '3s' }}>
        <div className="p-3 rounded-2xl bg-success/20 backdrop-blur-sm border border-success/30 shadow-lg">
          <Heart className="h-6 w-6 text-success" />
        </div>
      </div>
      <div className="absolute top-1/3 left-[10%] animate-float hidden lg:block" style={{ animationDelay: '2.5s' }}>
        <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 shadow-lg">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-primary">
            🇪🇹 Made for Ethiopian Families
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Children's{' '}
            <span className="gradient-text">Future Starts</span>{' '}
            <span className="relative inline-block">
              Here
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--secondary))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group shadow-xl hover:shadow-2xl">
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/guidance">
              <Button variant="outline" size="xl" className="border-2">
                {t('hero.learn')}
            </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex items-center justify-center gap-2 mb-12">
            <div className="flex -space-x-2">
              {['🧑‍🎓', '👩‍🏫', '👨‍👩‍👧', '👩‍👧‍👦'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">500+</span> Ethiopian families
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
            </div>
            <div className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/20 mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">12+</div>
                <div className="text-sm text-muted-foreground">Grade Levels</div>
              </div>
            </div>
            <div className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-3 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-muted/30"
          />
        </svg>
      </div>
    </section>
  );
}
