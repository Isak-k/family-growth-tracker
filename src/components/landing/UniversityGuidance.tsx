import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const departments = [
  { name: 'Engineering & Technology', match: 92 },
  { name: 'Computer Science & ICT', match: 88 },
  { name: 'Medicine & Health Sciences', match: 85 },
  { name: 'Business & Economics', match: 78 },
  { name: 'Natural Sciences', match: 75 },
];

export function UniversityGuidance() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 mb-6">
              <span className="text-sm font-medium text-secondary">Ethiopian Universities</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Smart Department Recommendations
            </h2>
            
            <p className="text-muted-foreground mb-8">
              Based on your child's actual academic performance, we analyze their strengths 
              and provide personalized recommendations for Ethiopian university departments.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Match performance with department requirements',
                'Show readiness level (High, Medium, Low)',
                'Provide clear explanations for each suggestion',
                'Cover 50+ Ethiopian university departments',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/guidance">
              <Button variant="hero" size="lg" className="group">
                Explore Guidance
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Preview Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-2xl" />
            <div className="relative card-elevated p-8 rounded-2xl">
              <h3 className="font-display text-xl font-semibold mb-6">
                Top Matching Departments
              </h3>
              
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={dept.name} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{dept.name}</span>
                        <span className="text-sm font-semibold text-success">{dept.match}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                          style={{ width: `${dept.match}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning">
                  <strong>Note:</strong> These recommendations are for guidance only. Final admission 
                  depends on official entrance exam results and university criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
