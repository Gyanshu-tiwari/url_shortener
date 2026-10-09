import { useState, useCallback } from 'react';

const URLInput = ({ onShorten }) => {
  const [originalURL, setOriginalURL] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const normalizeInputUrl = (input) => {
    let trimmed = input.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  const validateURL = useCallback((url) => {
    if (!url || !url.trim()) return false;
    try {
      const candidate = normalizeInputUrl(url);
      const parsed = new URL(candidate);
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        Boolean(parsed.hostname) &&
        (parsed.hostname === 'localhost' || parsed.hostname.includes('.'))
      );
    } catch {
      return false;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');

      const rawUrl = originalURL.trim();
      if (!rawUrl) {
        setError('Please enter a destination URL to shorten.');
        return;
      }

      if (!validateURL(rawUrl)) {
        setError('Please enter a valid URL (e.g., https://example.com or github.com).');
        return;
      }

      const trimmedCode = customCode.trim();
      if (trimmedCode) {
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(trimmedCode)) {
          setError(
            'Custom code must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores.',
          );
          return;
        }
      }

      setIsLoading(true);
      try {
        const normalized = normalizeInputUrl(rawUrl);
        await onShorten({ originalURL: normalized, customCode: trimmedCode });
        setOriginalURL('');
        setCustomCode('');
      } catch (err) {
        setError(err.message || 'Failed to shorten URL. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [originalURL, customCode, validateURL, onShorten],
  );

  return (
    <section className="w-full bg-linear-to-b from-blue-50/60 via-white to-gray-50 py-10 md:py-16 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 p-6 sm:p-8 md:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Shorten Your Links in Seconds
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Create clean, memorable, and trackable links with optional custom aliases.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="url-input" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Destination URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="text"
                  value={originalURL}
                  onChange={(e) => {
                    setOriginalURL(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="https://example.com/very/long/url or github.com"
                  className="w-full px-4 py-3.5 text-sm md:text-base bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="custom-code-input" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Custom Short Code <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <span className="text-[11px] text-gray-400">3-30 letters, numbers, -, _</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-gray-400 select-none">/</span>
                <input
                  id="custom-code-input"
                  type="text"
                  value={customCode}
                  onChange={(e) => {
                    setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                    if (error) setError('');
                  }}
                  placeholder="my-custom-link"
                  className="w-full pl-7 pr-4 py-3.5 text-sm md:text-base font-mono bg-gray-50/50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5 animate-shake">
                <span className="text-base leading-none">⚠️</span>
                <span className="flex-1">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99] text-base cursor-pointer"
            >
              {isLoading ? 'Creating Short Link...' : 'Shorten URL Now →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default URLInput;

