import { UserPlus, BookOpen, TrendingUp, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Family Account',
    description: 'Sign up as a parent and add your children to your private family dashboard.',
    emoji: '👨‍👩‍👧‍👦',
    color: 'primary' as const,
  },
  {
    icon: BookOpen,
    title: 'Enter Academic Records',
    description: 'Add courses, grades, and academic years. Track every subject and term.',
    emoji: '📝',
    color: 'secondary' as const,
  },
  {
    icon: TrendingUp,
    title: 'Monitor Progress',
    description: 'View real-time analytics, charts, and performance trends over time.',
    emoji: '📊',
    color: 'accent' as const,
  },
  {
    icon: GraduationCap,
    title: 'Get University Guidance',
    description: 'Receive personalized department recommendations based on actual performance.',
    emoji: '🎯',
    color: 'success' as const,
  },
];

const colorMap = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/20 text-secondary border-secondary/30',
  accent: 'bg-accent/10 text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
};

const lineColorMap = {
  primary: 'from-primary/40',
  secondary: 'from-secondary/40',
  accent: 'from-accent/40',
  success: 'from-success/40',
};

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">🚀 Simple & powerful</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes and watch your family's academic journey unfold.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }} className="relative text-center group">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className={`hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r ${lineColorMap[step.color]} to-transparent`} />
              )}
              
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl border-2 ${colorMap[step.color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
