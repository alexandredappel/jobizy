
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
          
          {/* Search Box */}
          <div className="bg-white p-2 rounded-full shadow-lg flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-3 pl-6">
              <Search className="w-5 h-5 text-primary/50" />
              <input 
                type="text"
                placeholder="Search job positions..."
                className="w-full bg-transparent outline-none text-primary"
              />
            </div>
            <Button className="rounded-full px-8">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Our Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Direct Messaging",
                price: "$0/day",
                description: "Connect directly with potential employers",
                color: "bg-pink-100",
              },
              {
                title: "Profile Management",
                price: "$0/day",
                description: "Create and manage your professional profile",
                color: "bg-blue-100",
              },
              {
                title: "Job Alerts",
                price: "$0/day",
                description: "Get notified about new opportunities",
                color: "bg-green-100",
              }
            ].map((service) => (
              <div 
                key={service.title}
                className={`rounded-3xl ${service.color} p-8 text-center hover:scale-105 transition-transform duration-300`}
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {service.title}
                </h3>
                <p className="text-lg font-semibold text-secondary mb-2">
                  {service.price}
                </p>
                <p className="text-secondary/80">
                  {service.description}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 rounded-full"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Free Profile Creation",
                description: "Create your professional profile and start connecting with businesses in minutes"
              },
              {
                title: "Exceptional Support",
                description: "Our team is here to help you every step of the way with 24/7 support"
              },
              {
                title: "Modern Platform",
                description: "Use our easy-to-use platform to manage your job search efficiently"
              }
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  {benefit.title}
                </h3>
                <p className="text-secondary/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            People Love Jobizy
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="bg-[#FFF8E7] p-8 rounded-3xl"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-secondary/80 mb-4">
                  "Great platform! Found my dream job in Bali within days. The process was smooth and the support team was very helpful."
                </p>
                <p className="font-semibold text-primary">- Happy User</p>
              </div>
            ))}
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
