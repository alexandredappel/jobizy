
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, User, Zap, Layout, Wifi, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5DEFF] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#D6BCFA] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#9b87f5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300" />
      
      {/* Header */}
      <header className="p-6 relative">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-4xl font-bold text-[#1A1F2C]">
            Jobizy
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="#" className="text-[#1A1F2C] font-medium">Help</Link>
            <Button className="rounded-full bg-[#9b87f5] hover:bg-[#8B5CF6]">
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-[#1A1F2C] mb-6 animate-fade-in">
            Find Your Next Job in Bali
          </h1>
          <p className="text-xl md:text-2xl text-[#8E9196] mb-12">
            The quick and easy way to connect with hospitality businesses
          </p>
          
          <Button className="rounded-full px-8 text-lg bg-[#9b87f5] hover:bg-[#8B5CF6] hover:scale-105 transition-transform">
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Business Column */}
            <div className="text-center p-8 bg-gradient-to-br from-[#D6BCFA] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <BriefcaseBusiness className="w-16 h-16 mx-auto mb-6 text-[#9b87f5] animate-bounce" />
              <h2 className="text-3xl font-bold text-[#1A1F2C] mb-8">
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
                    <span className="w-2 h-2 bg-[#9b87f5] rounded-full"></span>
                    <span className="text-lg text-[#8E9196]">{point}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 rounded-full bg-[#9b87f5] hover:bg-[#8B5CF6] hover:scale-105 transition-transform">
                Hire Talent
              </Button>
            </div>

            {/* Worker Column */}
            <div className="text-center p-8 bg-gradient-to-br from-[#E5DEFF] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <User className="w-16 h-16 mx-auto mb-6 text-[#9b87f5] animate-bounce" />
              <h2 className="text-3xl font-bold text-[#1A1F2C] mb-8">
                Find your next hospitality job in Bali
              </h2>
              <ul className="space-y-4 text-left">
                {[
                  "Create your profile",
                  "Control your availability",
                  "Direct employer contact",
                  "Island-wide opportunities"
                ].map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#9b87f5] rounded-full"></span>
                    <span className="text-lg text-[#8E9196]">{point}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 rounded-full bg-[#9b87f5] hover:bg-[#8B5CF6] hover:scale-105 transition-transform">
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Speed */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#E5DEFF] to-white hover:shadow-lg transition-all duration-300">
              <Zap className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Find in a few clicks</h3>
              <p className="text-[#8E9196]">Quick and efficient matching</p>
            </div>

            {/* Simplicity */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#D6BCFA] to-white hover:shadow-lg transition-all duration-300">
              <Layout className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Intuitive interface</h3>
              <p className="text-[#8E9196]">Easy to use platform</p>
            </div>

            {/* Flexibility */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#E5DEFF] to-white hover:shadow-lg transition-all duration-300">
              <Wifi className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Available offline</h3>
              <p className="text-[#8E9196]">Work even without internet</p>
            </div>

            {/* Reliability */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#D6BCFA] to-white hover:shadow-lg transition-all duration-300">
              <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Verified profiles</h3>
              <p className="text-[#8E9196]">Trusted community</p>
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
                className="text-[#1A1F2C] hover:text-[#9b87f5] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Additional Decorative Elements */}
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-[#D6BCFA] rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
      <div className="absolute bottom-40 right-20 w-56 h-56 bg-[#E5DEFF] rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500" />
    </div>
  );
};

export default Home;
