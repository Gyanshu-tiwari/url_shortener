import { useState, useEffect, useCallback, memo } from 'react';

const HistoryItem = memo(({ item, onCopy, copied, onDelete }) => {
  const shortUrl = item.shortURL || item.shortUrl;
  const originalUrl = item.originalURL || item.originalUrl;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4 md:p-5 hover:shadow-md transition">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Original Destination
          </p>
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={originalUrl}
            className="text-gray-700 hover:text-blue-600 break-all text-sm font-medium transition line-clamp-2"
          >
            {originalUrl}
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Shortened URL
          </p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-bold text-sm truncate block transition"
          >
            {shortUrl}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onCopy(item.id, shortUrl)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={() => shortUrl && window.open(shortUrl, '_blank', 'noopener,noreferrer')}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
        >
          Visit ↗
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition ml-auto"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between">
        <span>Code: <strong className="font-mono text-gray-700">{item.shortCode}</strong></span>
        <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently created'}</span>
      </div>
    </div>
  );
});

HistoryItem.displayName = 'HistoryItem';

const URLHistory = ({ history, onDelete, onClear }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = useCallback((id, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
  }, []);

  useEffect(() => {
    if (copiedId === null) return;
    const timer = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedId]);

  if (!history || history.length === 0) {
    return (
      <section className="w-full py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent URLs</h2>
          </div>
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-base font-medium text-gray-600">No shortened URLs yet</p>
            <p className="text-xs text-gray-500 mt-1">Shorten a long URL above to build your quick-access link history.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent URLs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Stored locally in your browser (last 10 links)</p>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all URL history?')) {
                  onClear();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onCopy={handleCopy}
              copied={copiedId === item.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default URLHistory;

