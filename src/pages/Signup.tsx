import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Users, Shield, Heart, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, loading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AppRole>('admin');
  const [religion, setReligion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword || !religion) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password, role, fullName, religion);
    setIsSubmitting(false);

    if (error) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account Created!', description: 'Please check your email to verify your account.' });
      navigate('/login');
    }
  };

  const benefits = [
    { icon: Heart, text: 'Track all your children in one place' },
    { icon: Star, text: 'Personalized university recommendations' },
    { icon: Award, text: 'Beautiful analytics and progress reports' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary via-secondary/90 to-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border border-secondary-foreground/30 rounded-full animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 border border-secondary-foreground/20 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="relative text-secondary-foreground max-w-lg">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary-foreground/10 mb-8 backdrop-blur-sm">
              <Users className="h-10 w-10" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">
              Join Thousands of Ethiopian Families
            </h2>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              Create a private space for your family's educational journey. 
              Track progress, set goals, and guide your children toward success.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-foreground/5 backdrop-blur-sm border border-secondary-foreground/10">
                <div className="p-2 rounded-lg bg-secondary-foreground/10">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-secondary-foreground/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-12 relative">
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="max-w-md w-full mx-auto relative">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">EduFamily</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              {t('auth.createAccount')} 🎉
            </h1>
            <p className="text-muted-foreground text-lg">
              Start tracking your family's academic success today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Parent-only signup */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-primary">{t('auth.parent')}</p>
                <p className="text-xs text-muted-foreground">
                  Only parents create an account here. After signing up, add your children in Settings — they sign in with the account you create for them.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">{t('auth.familyName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="Enter your full name" className="pl-10 h-12 rounded-xl" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion" className="text-sm font-medium">Family Religion</Label>
              <select id="religion" value={religion} onChange={(e) => setReligion(e.target.value)} required className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="" disabled>Select religion</option>
                <option value="islam">Islam</option>
                <option value="christianity">Christianity</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
              <p className="text-xs text-muted-foreground">Families choosing Islam get the Islamic Learning section for parents and children.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="your@email.com" className="pl-10 h-12 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 h-12 rounded-xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full h-12 rounded-xl text-base" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Creating account...' : t('nav.signup')}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">{t('nav.login')}</Link>
          </p>

          <div className="mt-8 flex justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
