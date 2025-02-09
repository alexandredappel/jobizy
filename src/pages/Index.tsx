
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, User, Zap, LayoutDashboard, Globe, ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#eefceb]">
      {/* Hero Section */}
      <div className="relative">
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 py-4">
          <div className="container mx-auto px-4">
            <Link to="/" className="text-2xl font-bold text-primary">Jobizy</Link>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-24 lg:pt-32">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6">
                Your 24/7 HR Solution in Bali
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Connect directly with talents or employers in Bali
              </p>
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Sign Up
                </Button>
              </Link>
            </div>
            <div className="flex-1 hidden lg:block">
              <img 
                src="/placeholder.svg" 
                alt="Hero" 
                className="w-full h-auto rounded-lg shadow-lg animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* For Businesses */}
            <div className="card p-8 animate-fade-in">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Building2 className="w-16 h-16 text-primary mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
                  The talent you need, when you need it
                </h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Advanced candidate search
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Direct contact with available workers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Emergency replacement solution
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Precise filters (location, languages, experience)
                  </li>
                </ul>
              </div>
            </div>

            {/* For Workers */}
            <div className="card p-8 animate-fade-in">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <User className="w-16 h-16 text-primary mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
                  Find your next hospitality job in Bali
                </h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Showcase your skills
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Control your availability
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Direct employer contact
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Island-wide opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Speed */}
            <div className="card p-6 text-center animate-fade-in">
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">Find in a few clicks</h3>
                <p className="text-gray-600">Quick and efficient matching</p>
              </div>
            </div>

            {/* Simplicity */}
            <div className="card p-6 text-center animate-fade-in">
              <div className="flex flex-col items-center">
                <LayoutDashboard className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">Intuitive interface</h3>
                <p className="text-gray-600">Easy to use platform</p>
              </div>
            </div>

            {/* Flexibility */}
            <div className="card p-6 text-center animate-fade-in">
              <div className="flex flex-col items-center">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">Available offline</h3>
                <p className="text-gray-600">Work even without internet</p>
              </div>
            </div>

            {/* Reliability */}
            <div className="card p-6 text-center animate-fade-in">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">Verified profiles</h3>
                <p className="text-gray-600">Trusted community</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
