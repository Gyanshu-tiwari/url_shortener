const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-10 md:py-14 mt-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔗</span>
              <h3 className="text-white font-bold text-lg">LinkShort</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fast, resilient, and lightweight URL shortener service built with Node.js, Express, MongoDB, and React.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Key Features</h3>
            <ul className="text-xs space-y-2 text-gray-400">
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Instant Nanoid short link generation</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Custom short code aliases</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Click redirect tracking & statistics</li>
              <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Local history with one-click copy</li>
            </ul>
          </div>

          {/* Stack & License */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Open Source</h3>
            <ul className="text-xs space-y-2 text-gray-400">
              <li>MIT Licensed</li>
              <li>RESTful API Architecture</li>
              <li>Production Ready</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} LinkShort. All rights reserved.</p>
          <p className="flex items-center gap-1">Designed for speed & simplicity</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

