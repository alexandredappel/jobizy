
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, User, Zap, Layout, Wifi, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#F2FCE2] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#FEF7CD] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300" />
      
      {/* Header */}
      <header className="p-6 relative">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-4xl font-bold text-primary">
            Jobizy
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="#" className="text-primary font-medium">Help</Link>
            <Button className="rounded-full">
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-6xl md:text-7xl font-bold text-primary mb-6 animate-fade-in">
              Find Your Next Job in Bali
            </h1>
            <p className="text-xl md:text-2xl text-secondary/80 mb-12">
              The quick and easy way to connect with hospitality businesses
            </p>
            
            <Button className="rounded-full px-8 text-lg hover:scale-105 transition-transform">
              Sign Up Now
            </Button>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/jobizy-8a101.appspot.com/o/UX%2FBartender.svg?alt=media&token=65142b2e-b111-4185-aaad-c2b20dd1328d"
              alt="Bartender illustration"
              className="w-full h-auto max-w-md mx-auto animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Speed */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#F2FCE2] to-white hover:shadow-lg transition-all duration-300">
              <Zap className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-bold text-primary mb-4">Find in a few clicks</h3>
              <p className="text-secondary/80">Quick and efficient matching</p>
            </div>

            {/* Simplicity */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#FEF7CD] to-white hover:shadow-lg transition-all duration-300">
              <Layout className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-bold text-primary mb-4">Intuitive interface</h3>
              <p className="text-secondary/80">Easy to use platform</p>
            </div>

            {/* Flexibility */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#D3E4FD] to-white hover:shadow-lg transition-all duration-300">
              <Wifi className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-bold text-primary mb-4">Available offline</h3>
              <p className="text-secondary/80">Work even without internet</p>
            </div>

            {/* Reliability */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#E5DEFF] to-white hover:shadow-lg transition-all duration-300">
              <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h3 className="text-xl font-bold text-primary mb-4">Verified profiles</h3>
              <p className="text-secondary/80">Trusted community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Business Column */}
            <div className="text-center p-8 bg-gradient-to-br from-[#F2FCE2] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <BriefcaseBusiness className="w-16 h-16 mx-auto mb-6 text-primary animate-bounce" />
              <h2 className="text-3xl font-bold text-primary mb-8">
                The talent you need, when you need it
              </h2>
              <ul className="space-y-4 text-left">
                {[
                  "Advanced candidate search",
                  "Direct contact with available workers",
                  "Emergency replacement solution",
                  "Precise filters (location, languages, experience)"
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-lg text-secondary/80">{point}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 rounded-full hover:scale-105 transition-transform">
                Hire Talent
              </Button>
            </div>

            {/* Worker Column */}
            <div className="text-center p-8 bg-gradient-to-br from-[#FEF7CD] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <User className="w-16 h-16 mx-auto mb-6 text-primary animate-bounce" />
              <h2 className="text-3xl font-bold text-primary mb-8">
                Find your next hospitality job in Bali
              </h2>
              <ul className="space-y-4 text-left">
                {[
                  "Showcase your skills",
                  "Control your availability",
                  "Direct employer contact",
                  "Island-wide opportunities"
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-lg text-secondary/80">{point}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 rounded-full hover:scale-105 transition-transform">
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Help", "Contact", "About", "Terms"].map((item) => (
              <Link 
                key={item}
                to="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Additional Decorative Elements */}
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-[#D3E4FD] rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
      <div className="absolute bottom-40 right-20 w-56 h-56 bg-[#E5DEFF] rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500" />
    </div>
  );
};

export default Home;
