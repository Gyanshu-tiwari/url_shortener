import { useState, useEffect, useCallback } from 'react';

const URLResult = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const finalShortUrl = result?.shortURL || result?.shortUrl || '';

  const handleCopy = useCallback(() => {
    if (!finalShortUrl) return;
    navigator.clipboard.writeText(finalShortUrl);
    setCopied(true);
  }, [finalShortUrl]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            ✓
          </div>
        </div>

        <h3 className="text-2xl font-extrabold text-gray-800 text-center mb-2">
          URL Shortened!
        </h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Your link is ready to share with anyone
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Original Destination
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 break-all max-h-24 overflow-y-auto">
            {result.originalURL || result.originalUrl}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Short Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={finalShortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-700 font-semibold text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 font-semibold text-sm rounded-xl transition shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-gray-50 rounded-xl text-sm border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Short Code</p>
            <p className="font-bold text-gray-800 font-mono">{result.shortCode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="font-semibold text-gray-800">
              {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Just now'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => finalShortUrl && window.open(finalShortUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm shadow-md"
          >
            Visit Link ↗
          </button>
        </div>
      </div>
    </div>
  );
};

export default URLResult;

