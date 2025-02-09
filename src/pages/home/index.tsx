const Home = () => {
  return (
    <div className="min-h-screen bg-[#eefceb]">
      {/* Header - Using existing style */}
      <header className="absolute top-0 left-0 right-0 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-primary">
            Jobizy
          </Link>
          <Button variant="ghost" className="text-primary">
            Menu
          </Button>
        </nav>
      </header>

      {/* Hero Section - Adapted to brand colors */}
      <main className="relative pt-32 pb-20">
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
              Find your next
              <br />
              <span className="text-secondary">job in Bali</span>
            </h1>
            <p className="text-2xl md:text-4xl text-secondary/80">
              The quick and easy way to connect
              <br />
              workers and businesses.
            </p>
          </div>

          {/* Action Card - Using existing card style */}
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">I am a</label>
                  <select className="input w-full p-3">
                    <option>Worker</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Looking for</label>
                  <select className="input w-full p-3">
                    <option>Restaurant Jobs</option>
                    <option>Hotel Jobs</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <Button className="w-full py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
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

// Animation classes to add in index.css
@layer utilities {
  .blur-xl {
    filter: blur(24px);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
}
