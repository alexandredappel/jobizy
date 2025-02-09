
import { Link } from 'react-router-dom';
import { Building, User, Zap, MousePointer, Wifi, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Jobizy
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Your 24/7 HR Solution in Bali
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Connect directly with talents or employers in Bali
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Sign Up
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block animate-fade-in">
              {/* Placeholder for hero image */}
              <div className="aspect-video bg-secondary/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Businesses */}
            <div className="space-y-6 p-8 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-secondary/10 rounded-lg">
                <Building className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">The talent you need, when you need it</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Advanced candidate search
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Direct contact with available workers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Emergency replacement solution
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Precise filters (location, languages, experience)
                </li>
              </ul>
            </div>

            {/* For Workers */}
            <div className="space-y-6 p-8 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-primary/10 rounded-lg">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Find your next hospitality job in Bali</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Showcase your skills
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Control your availability
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Direct employer contact
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Island-wide opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Speed */}
            <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-accent/10 rounded-lg">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Find in a few clicks</h3>
              <p className="text-muted-foreground">Quick and efficient matching</p>
            </div>

            {/* Simplicity */}
            <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-accent/10 rounded-lg">
                <MousePointer className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Intuitive interface</h3>
              <p className="text-muted-foreground">Easy to use platform</p>
            </div>

            {/* Flexibility */}
            <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-accent/10 rounded-lg">
                <Wifi className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Available offline</h3>
              <p className="text-muted-foreground">Work even without internet</p>
            </div>

            {/* Reliability */}
            <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm animate-fade-in">
              <div className="inline-block p-3 bg-accent/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Verified profiles</h3>
              <p className="text-muted-foreground">Trusted community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
