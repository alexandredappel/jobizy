
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, User } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="p-6">
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
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-6">
            Find Your Next Job in Bali
          </h1>
          <p className="text-xl md:text-2xl text-secondary/80 mb-12">
            The quick and easy way to connect with hospitality businesses
          </p>
          
          <Button className="rounded-full px-8 text-lg">
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Business Column */}
            <div className="text-center p-8 bg-[#F2FCE2] rounded-3xl">
              <BriefcaseBusiness className="w-16 h-16 mx-auto mb-6 text-primary" />
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
              <Button className="mt-8 rounded-full">
                Hire Talent
              </Button>
            </div>

            {/* Worker Column */}
            <div className="text-center p-8 bg-[#FEF7CD] rounded-3xl">
              <User className="w-16 h-16 mx-auto mb-6 text-primary" />
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
              <Button className="mt-8 rounded-full">
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFF8E7] py-12">
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
    </div>
  );
};

export default Home;
