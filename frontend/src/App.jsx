import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/layout/Header';
import URLInput from './components/URLInput';
import URLResult from './components/URLResult';
import URLHistory from './components/URLHistory';
import Footer from './components/layout/Footer';
import {
  shortenRequested,
  shortenSucceeded,
  shortenFailed,
  clearResult,
  deleteHistoryItem,
  clearHistory,
} from './store/urlSlice.js';
import { shortenUrl } from './api/urlApi.js';

const App = () => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.url.history);
  const result = useSelector((state) => state.url.result);

  const handleShorten = useCallback(
    async (data) => {
      dispatch(shortenRequested());

      try {
        const payload = {
          originalUrl: data.originalURL,
          ...(data.customCode?.trim() && { customCode: data.customCode.trim() }),
        };

        const shortenedData = await shortenUrl(payload);

        const newEntry = {
          id: Date.now(),
          originalURL: data.originalURL,
          shortURL: shortenedData.shortUrl,
          shortUrl: shortenedData.shortUrl,
          shortCode: shortenedData.shortCode,
          createdAt: new Date().toISOString(),
        };

        dispatch(shortenSucceeded(newEntry));
      } catch (error) {
        dispatch(shortenFailed(error.message));
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteHistory = useCallback(
    (id) => {
      dispatch(deleteHistoryItem(id));
    },
    [dispatch],
  );

  const handleClearHistory = useCallback(
    () => {
      dispatch(clearHistory());
    },
    [dispatch],
  );

  const handleCloseResult = useCallback(
    () => {
      dispatch(clearResult());
    },
    [dispatch],
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <URLInput onShorten={handleShorten} />
        <URLHistory
          history={history}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
        />
      </main>
      <URLResult result={result} onClose={handleCloseResult} />
      <Footer />
    </div>
  );
};

export default App;

