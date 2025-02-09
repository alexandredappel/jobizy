import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  User, 
  Search, 
  MousePointer, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec effet glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Jobizy
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Your <span className="text-primary">HR Solution</span>
                <br />in Bali
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Connect directly with talents or employers in Bali
              </p>
              <div className="pt-4">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-10 py-7 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Section d'inscription/recherche */}
            <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm animate-float">
              <h2 className="text-2xl font-bold mb-6">Find your match</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">I am a</label>
                  <select className="w-full p-3 rounded-xl border">
                    <option>Worker</option>
                    <option>Business</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Looking for</label>
                  <select className="w-full p-3 rounded-xl border">
                    <option>Restaurant Jobs</option>
                    <option>Hotel Jobs</option>
                    <option>Other</option>
                  </select>
                </div>
                <Button className="w-full py-6 text-lg font-bold bg-primary text-white">
                  Search Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Businesses */}
            <div className="space-y-6 p-8 bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-secondary/10 rounded-2xl">
                <Building className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">The talent you need, when you need it</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Advanced candidate search
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Direct contact with available workers
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Emergency replacement solution
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Precise filters (location, languages, experience)
                </li>
              </ul>
            </div>

            {/* For Workers */}
            <div className="space-y-6 p-8 bg-white rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-block p-4 bg-primary/10 rounded-2xl">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Find your next hospitality job in Bali</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Showcase your skills
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Control your availability
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Direct employer contact
                </li>
                <li className="flex items-center gap-3">
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
            <div className="group space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="inline-block p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Quick Search</h3>
              <p className="text-muted-foreground">Find the perfect match in minutes</p>
            </div>

            {/* Simplicity */}
            <div className="group space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="inline-block p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                <MousePointer className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Easy to Use</h3>
              <p className="text-muted-foreground">Intuitive interface for everyone</p>
            </div>

            {/* Availability */}
            <div className="group space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="inline-block p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Real-time Status</h3>
              <p className="text-muted-foreground">Know who's available now</p>
            </div>

            {/* Trust */}
            <div className="group space-y-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="inline-block p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Verified Profiles</h3>
              <p className="text-muted-foreground">Trusted community members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="bg-primary text-white hover:bg-primary/90 shadow-lg px-8"
        >
          Sign Up Now
        </Button>
      </div>
    </div>
  );
};

export default Home;
