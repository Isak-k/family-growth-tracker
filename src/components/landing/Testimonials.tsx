import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Abeba Tadesse',
    role: 'Mother of 3',
    content: 'EduFamily helped me track all three of my children\'s grades in one place. The university guidance feature gave us so much clarity about which departments to aim for!',
    rating: 5,
    avatar: '👩',
  },
  {
    name: 'Dawit Bekele',
    role: 'Father of 2',
    content: 'As a busy parent, having real-time updates on my children\'s academic progress is invaluable. The analytics charts make it easy to spot areas that need attention.',
    rating: 5,
    avatar: '👨',
  },
  {
    name: 'Hiwot Mekonnen',
    role: 'Mother of 1',
    content: 'The multilingual support means my whole family can use it. My daughter loves checking her own progress in Amharic. It motivates her to study harder!',
    rating: 5,
    avatar: '👩‍🦱',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <span className="text-sm font-medium text-secondary">💬 What families say</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Loved by Ethiopian Families
          </h2>
          <p className="text-lg text-muted-foreground">
            See how EduFamily is helping parents guide their children toward academic success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote className="h-8 w-8" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
