
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotatingText } from "@/components/ui/rotating-text";
import { 
  BriefcaseBusiness, 
  User, 
  Building2, 
  Building, 
  HomeIcon, 
  GlassWater, 
  ChefHat, 
  Coffee, 
  BadgeEuro, 
  UsersRound, 
  Hammer, 
  Beer, 
  ShoppingCart,
  Sparkles,
  LayoutGrid,
  Signal,
  Shield
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eefceb] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#439915] rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#5EC435] rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      
      {/* Header */}
      <header className="p-6 relative">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-4xl font-bold text-[#1A1F2C]">
            Jobizy
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="#" className="text-[#1A1F2C] font-medium">Help</Link>
            <Link to="/signup">
              <Button 
                variant="default"
                className="bg-[#439915] hover:bg-[#317110] text-white font-semibold px-6 py-2 rounded-md transition-all duration-200 hover:shadow-lg"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-[#1A1F2C] mb-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <span>Find your next</span>
              <RotatingText words={["Staff", "Job"]} />
              <span>in Bali</span>
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-[#8E9196] mb-12">
            The quick and easy way to connect with hospitality businesses
          </p>
          
          <Link to="/signup">
            <Button 
              className="bg-[#439915] hover:bg-[#317110] text-white font-semibold px-8 py-6 rounded-md transition-all duration-200 hover:shadow-lg text-lg"
            >
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-24 bg-gradient-to-b from-[#eefceb] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1A1F2C]">
            For Every Type of Business
          </h2>
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 gap-6 snap-x snap-mandatory md:snap-none mb-12">
            {[
              { type: 'Restaurant', icon: Coffee, description: 'From casual dining to fine restaurants' },
              { type: 'Hotel', icon: Building2, description: 'Luxury and boutique hotels' },
              { type: 'Property Management', icon: Building, description: 'Villa and property services' },
              { type: 'Guest House', icon: HomeIcon, description: 'Cozy and welcoming stays' },
              { type: 'Club', icon: GlassWater, description: 'Nightlife and entertainment venues' }
            ].map(({ type, icon: Icon, description }) => (
              <div key={type} className="flex-none w-[90vw] md:w-auto snap-center">
                <div className="flex flex-col items-center p-8 bg-gradient-to-br from-[#eefceb] to-white rounded-xl hover:shadow-lg transition-all duration-300 h-full">
                  <Icon className="w-16 h-16 text-[#439915] mb-6" />
                  <h3 className="text-2xl font-semibold text-[#1A1F2C] mb-4">{type}</h3>
                  <p className="text-[#8E9196] text-center">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/signup">
              <Button 
                className="bg-[#439915] hover:bg-[#317110] text-white font-semibold px-8 py-4 rounded-md transition-all duration-200 hover:shadow-lg text-lg"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Types Section */}
      <section className="py-24 bg-gradient-to-b from-[#eefceb] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1A1F2C]">
            Available Positions
          </h2>
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 gap-6 snap-x snap-mandatory md:snap-none mb-12">
            {[
              { type: 'Waiter', icon: Coffee, description: 'Front of house service professionals' },
              { type: 'Cook', icon: ChefHat, description: 'Kitchen and culinary experts' },
              { type: 'Cashier', icon: BadgeEuro, description: 'Payment and transaction handling' },
              { type: 'Manager', icon: UsersRound, description: 'Team leadership and operations' },
              { type: 'Housekeeper', icon: HomeIcon, description: 'Cleaning and maintenance' },
              { type: 'Gardener', icon: Hammer, description: 'Landscape and garden care' },
              { type: 'Bartender', icon: Beer, description: 'Beverage service specialists' },
              { type: 'Seller', icon: ShoppingCart, description: 'Retail and sales professionals' }
            ].map(({ type, icon: Icon, description }) => (
              <div key={type} className="flex-none w-[90vw] md:w-auto snap-center">
                <div className="flex flex-col items-center p-8 bg-gradient-to-br from-[#eefceb] to-white rounded-xl hover:shadow-lg transition-all duration-300 h-full">
                  <Icon className="w-16 h-16 text-[#439915] mb-6" />
                  <h3 className="text-2xl font-semibold text-[#1A1F2C] mb-4">{type}</h3>
                  <p className="text-[#8E9196] text-center">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/signup">
              <Button 
                className="bg-[#439915] hover:bg-[#317110] text-white font-semibold px-8 py-4 rounded-md transition-all duration-200 hover:shadow-lg text-lg"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-gradient-to-br from-[#eefceb] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <BriefcaseBusiness className="w-16 h-16 mx-auto mb-6 text-[#439915] animate-bounce" />
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
                    <span className="w-2 h-2 bg-[#439915] rounded-full"></span>
                    <span className="text-lg text-[#8E9196]">{point}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="mt-8 rounded-full bg-[#439915] hover:bg-[#317110] hover:scale-105 transition-transform">
                  Hire Talent
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-[#eefceb] to-white rounded-3xl hover:shadow-xl transition-all duration-300">
              <User className="w-16 h-16 mx-auto mb-6 text-[#439915] animate-bounce" />
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
                    <span className="w-2 h-2 bg-[#439915] rounded-full"></span>
                    <span className="text-lg text-[#8E9196]">{point}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="mt-8 rounded-full bg-[#439915] hover:bg-[#317110] hover:scale-105 transition-transform">
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#eefceb] to-white hover:shadow-lg transition-all duration-300">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-[#439915]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Find in a few clicks</h3>
              <p className="text-[#8E9196]">Quick and efficient matching</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#eefceb] to-white hover:shadow-lg transition-all duration-300">
              <LayoutGrid className="w-12 h-12 mx-auto mb-6 text-[#439915]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Intuitive interface</h3>
              <p className="text-[#8E9196]">Easy to use platform</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#eefceb] to-white hover:shadow-lg transition-all duration-300">
              <Signal className="w-12 h-12 mx-auto mb-6 text-[#439915]" />
              <h3 className="text-xl font-bold text-[#1A1F2C] mb-4">Available offline</h3>
              <p className="text-[#8E9196]">Work even without internet</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#eefceb] to-white hover:shadow-lg transition-all duration-300">
              <Shield className="w-12 h-12 mx-auto mb-6 text-[#439915]" />
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
                className="text-[#1A1F2C] hover:text-[#439915] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Additional Decorative Elements */}
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-[#439915] rounded-full mix-blend-multiply filter blur-xl opacity-20" />
      <div className="absolute bottom-40 right-20 w-56 h-56 bg-[#5EC435] rounded-full mix-blend-multiply filter blur-xl opacity-20" />
    </div>
  );
};

export default Home;

