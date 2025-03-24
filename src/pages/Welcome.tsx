
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, Calendar, Search, Settings, ArrowRight, RotateCw, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import Translate from '@/components/Translate';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/contexts/TranslationContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/utils/translationUtils';
import { toast } from 'sonner';

const Welcome: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, translateApiKey } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
    
    // Show toast message to confirm language change
    const langName = SUPPORTED_LANGUAGES[value as SupportedLanguage]?.name || value;
    toast.success(`Language changed to ${langName}`);
    
    // Show warning if API key is missing
    if (value !== 'english' && !translateApiKey) {
      toast.warning('No translation API key set. Please add one in Settings.', {
        action: {
          label: 'Settings',
          onClick: () => window.location.href = '/settings',
        },
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                <SelectItem key={key} value={key}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button size="sm" asChild>
              <Link to="/profile"><Translate text="My Profile" /></Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/sign-in"><Translate text="Sign In" /></Link>
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-16 lg:pt-20">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    <Translate text="Find Your Perfect Salon Experience" />
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    <Translate text="Discover, book, and enjoy top-rated salons. Your journey to the perfect style starts here." />
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link to="/explore">
                      <Translate text="Explore Salons" />
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {!isAuthenticated && (
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/sign-up"><Translate text="Create Account" /></Link>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/env-test" className="hover:underline flex items-center">
                    <RotateCw className="mr-1 h-3 w-3" />
                    <Translate text="Test Environment" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                  <img
                    alt="Salon showcase"
                    className="object-cover w-full"
                    src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2036&auto=format&fit=crop"
                    style={{
                      aspectRatio: "600/400",
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-8 lg:space-y-10">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  <Translate text="How It Works" />
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground">
                  <Translate text="Our platform makes it easy to discover and book salon services in just a few steps" />
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 space-y-2 text-center">
                    <Search className="w-10 h-10 mx-auto text-primary" />
                    <h3 className="text-xl font-bold"><Translate text="Discover" /></h3>
                    <p className="text-muted-foreground">
                      <Translate text="Browse through our curated list of top-rated salons in your area" />
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 space-y-2 text-center">
                    <Calendar className="w-10 h-10 mx-auto text-primary" />
                    <h3 className="text-xl font-bold"><Translate text="Book" /></h3>
                    <p className="text-muted-foreground">
                      <Translate text="Select your preferred services and schedule an appointment" />
                    </p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-6 space-y-2 text-center">
                    <Scissors className="w-10 h-10 mx-auto text-primary" />
                    <h3 className="text-xl font-bold"><Translate text="Enjoy" /></h3>
                    <p className="text-muted-foreground">
                      <Translate text="Experience quality service and share your feedback" />
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          <Translate text="© 2023 Salon Finder. All rights reserved." />
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            <Translate text="Terms of Service" />
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            <Translate text="Privacy" />
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="/settings">
            <Settings className="h-3 w-3 inline mr-1" />
            <Translate text="Settings" />
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Welcome;
