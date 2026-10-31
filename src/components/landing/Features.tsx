import { 
  TrendingUp, 
  GraduationCap, 
  BookOpen, 
  Globe,
  BarChart3,
  Shield,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const features = [
  {
    icon: TrendingUp,
    titleKey: 'features.tracking.title',
    descKey: 'features.tracking.desc',
    color: 'primary' as const,
    emoji: '📈',
  },
  {
    icon: GraduationCap,
    titleKey: 'features.guidance.title',
    descKey: 'features.guidance.desc',
    color: 'secondary' as const,
    emoji: '🎓',
  },
  {
    icon: BookOpen,
    titleKey: 'features.history.title',
    descKey: 'features.history.desc',
    color: 'accent' as const,
    emoji: '📚',
  },
  {
    icon: Globe,
    titleKey: 'features.multilingual.title',
    descKey: 'features.multilingual.desc',
    color: 'success' as const,
    emoji: '🌍',
  },
];

const additionalFeatures = [
  { icon: BarChart3, title: 'Visual Analytics', desc: 'Charts and graphs for easy understanding', emoji: '📊' },
  { icon: Shield, title: 'Privacy First', desc: 'Your family data stays private', emoji: '🔒' },
  { icon: Clock, title: 'Year-by-Year', desc: 'Track progress over many years', emoji: '📅' },
  { icon: Users, title: 'Multi-Student', desc: 'Manage multiple children easily', emoji: '👨‍👩‍👧‍👦' },
];

export function Features() {
  const { t } = useLanguage();

  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/20 text-secondary border-secondary/30',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20',
  };

  const hoverBg = {
    primary: 'group-hover:bg-primary/15',
    secondary: 'group-hover:bg-secondary/25',
    accent: 'group-hover:bg-accent/15',
    success: 'group-hover:bg-success/15',
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-medium text-accent">✨ Everything you need</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete solution for tracking academic performance and guiding your children's educational journey.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/[0.02] group-hover:to-secondary/[0.02] transition-all duration-500" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${colorClasses[feature.color]} ${hoverBg[feature.color]} transition-colors duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group flex items-center gap-3 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-border/60 hover:bg-card/90 transition-all duration-300 hover:shadow-md"
            >
              <span className="text-xl flex-shrink-0">{feature.emoji}</span>
              <div>
                <div className="font-medium text-sm">{feature.title}</div>
                <div className="text-xs text-muted-foreground">{feature.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <Link to="/signup">
            <Button variant="hero" size="lg" className="group">
              Start Tracking Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
