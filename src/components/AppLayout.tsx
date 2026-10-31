import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Award,
  Compass,
  ClipboardList,
  MoreHorizontal,
  Search,
  BookHeart,
} from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

export const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, role, isAdmin, isStudent, isMuslim, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0)?.toUpperCase() || '?';

  const navItems = [
    { icon: BarChart3, label: t('nav.dashboard'), href: '/dashboard' },
    ...(isStudent ? [{ icon: Award, label: 'My Grades', href: '/my-grades' }] : []),
    ...(isAdmin ? [{ icon: Users, label: t('nav.students'), href: '/students' }] : []),
    ...(isAdmin ? [{ icon: BookOpen, label: t('nav.academics'), href: '/academics' }] : []),
    ...(isMuslim ? [{ icon: BookHeart, label: 'Islamic Learning', href: '/islamic-learning' }] : []),
    { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
    { icon: ClipboardList, label: 'Results', href: '/results' },
    { icon: Compass, label: t('nav.guidance'), href: '/guidance' },
    { icon: Calendar, label: t('nav.history'), href: '/personal-history' },
  ];

  const primaryMobileItems = navItems.slice(0, 4);
  const secondaryMobileItems = [
    ...navItems.slice(4),
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center justify-between h-14 px-4">
            <h1 className="font-display text-lg font-bold truncate">{title}</h1>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
              </button>
              <LanguageSelector />
              <button onClick={handleSignOut} aria-label="Log out" className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary">{initials}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="pt-14 px-4 py-6">{children}</main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/30 safe-area-pb">
          <div className="flex items-center justify-around h-16 px-2">
            {primaryMobileItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isActive(item.href) && "bg-primary/10"
                  )}>
                    <Icon className={cn("h-5 w-5", isActive(item.href) && "scale-110")} />
                  </div>
                  <span className={cn("text-[10px] font-medium truncate max-w-[56px]", isActive(item.href) && "font-bold")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
              <SheetTrigger asChild>
                <button className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                  secondaryMobileItems.some(i => isActive(i.href))
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    secondaryMobileItems.some(i => isActive(i.href)) && "bg-primary/10"
                  )}>
                    <MoreHorizontal className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium">More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl pb-8">
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-center font-display">More Options</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-4 gap-3">
                  {secondaryMobileItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <div className={cn("p-2.5 rounded-xl", isActive(item.href) ? "bg-primary/20" : "bg-background")}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-center">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
                <button
                  onClick={() => { setMoreOpen(false); handleSignOut(); }}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-card/80 backdrop-blur-xl border-r border-border/30 hidden lg:flex flex-col z-30">
        {/* Logo */}
        <div className="p-5 border-b border-border/30">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-foreground">EduFamily</span>
              <span className="block text-[10px] text-muted-foreground -mt-0.5 font-medium">Education Tracker</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/nav",
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] transition-transform", active && "scale-110")} />
                <span className="font-medium text-sm">{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border/30 space-y-0.5">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
              isActive('/settings')
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px]" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center justify-between px-6 py-3">
            <div>
              <h1 className="font-display text-xl font-bold">{title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-muted transition-colors group">
                {theme === 'dark' ? <Sun className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" /> : <Moon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />}
              </button>
              <LanguageSelector />
              <button onClick={handleSignOut} aria-label="Log out" className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
              <button className="relative p-2 rounded-xl hover:bg-muted transition-colors group">
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-border/50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-primary text-xs">{initials}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-sm leading-tight">{profile?.full_name || 'User'}</div>
                  <div className="text-xs text-muted-foreground capitalize">{role || 'User'}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
