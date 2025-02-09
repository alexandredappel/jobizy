
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Zap, 
  Monitor, 
  WifiOff, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Find in a few clicks",
    description: "Quick and efficient matching"
  },
  {
    icon: <Monitor className="w-8 h-8 text-primary" />,
    title: "Intuitive interface",
    description: "Easy to use platform"
  },
  {
    icon: <WifiOff className="w-8 h-8 text-primary" />,
    title: "Available offline",
    description: "Work even without internet"
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Verified profiles",
    description: "Trusted community"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#eefceb]">
      {/* Hero Section - Adapted to brand colors */}
      <main className="relative pt-20 pb-20">
        {/* Decorative Elements using brand colors */}
        <div className="absolute top-20 right-10">
          <div className="w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
        </div>
        <div className="absolute bottom-10 left-10">
          <div className="w-40 h-24 bg-primary/20 rounded-t-full blur-xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">
              Your 24/7
              <br />
              <span className="text-secondary">HR Solution in Bali</span>
            </h1>
            <p className="text-2xl md:text-4xl text-secondary/80">
              Connect directly with talents
              <br />
              or employers in Bali
            </p>
          </div>

          {/* Action Button */}
          <div className="max-w-2xl mx-auto">
            <Button className="w-full py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up Now
            </Button>
          </div>
        </div>
      </main>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Businesses */}
            <div className="card p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-primary">
                The talent you need, when you need it
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Advanced candidate search</li>
                <li>✓ Direct contact with available workers</li>
                <li>✓ Emergency replacement solution</li>
                <li>✓ Precise filters (location, languages, experience)</li>
              </ul>
            </div>

            {/* For Workers */}
            <div className="card p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-secondary">
                Find your next hospitality job in Bali
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Showcase your skills</li>
                <li>✓ Control your availability</li>
                <li>✓ Direct employer contact</li>
                <li>✓ Island-wide opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map(feature => (
              <div key={feature.title} className="card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
        >
          Sign Up Now
        </Button>
      </div>
    </div>
  );
};

export default Home;

