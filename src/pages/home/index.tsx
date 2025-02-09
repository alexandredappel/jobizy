const Home = () => {
  return (
    <div className="min-h-screen bg-yellow-300">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-black text-navy-900">
            Jobizy
          </Link>
          <Button variant="ghost" className="text-navy-900">
            Menu
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10">
          <div className="w-32 h-32 bg-teal-400 rounded-full opacity-50" />
        </div>
        <div className="absolute bottom-10 left-10">
          <div className="w-40 h-24 bg-green-300 rounded-t-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black text-navy-900 mb-6">
              Find your next
              <br />
              job in Bali
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-pink-500">
              The quick and easy way to connect
              <br />
              workers and businesses.
            </p>
          </div>

          {/* Action Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">I am a</label>
                  <select className="w-full p-3 rounded-xl border">
                    <option>Worker</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Looking for</label>
                  <select className="w-full p-3 rounded-xl border">
                    <option>Restaurant Jobs</option>
                    <option>Hotel Jobs</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <Button className="w-full py-6 text-lg font-bold bg-navy-900 text-white rounded-xl hover:bg-navy-800">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section - Simplified */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map(feature => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-300 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
