const STORAGE_KEY = 'urlHistory';

export const loadInitialHistory = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch {
    // Gracefully ignore storage quota / private browsing errors
  }
};

const initialState = {
  history: loadInitialHistory(),
  result: null,
  error: null,
  status: 'idle',
};

export const actionTypes = {
  shortenRequested: 'url/shortenRequested',
  shortenSucceeded: 'url/shortenSucceeded',
  shortenFailed: 'url/shortenFailed',
  clearResult: 'url/clearResult',
  deleteHistoryItem: 'url/deleteHistoryItem',
  clearHistory: 'url/clearHistory',
};

export const shortenRequested = () => ({ type: actionTypes.shortenRequested });
export const shortenSucceeded = (entry) => ({ type: actionTypes.shortenSucceeded, payload: entry });
export const shortenFailed = (error) => ({ type: actionTypes.shortenFailed, payload: error });
export const clearResult = () => ({ type: actionTypes.clearResult });
export const deleteHistoryItem = (id) => ({ type: actionTypes.deleteHistoryItem, payload: id });
export const clearHistory = () => ({ type: actionTypes.clearHistory });

export const urlReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.shortenRequested:
      return { ...state, status: 'loading', error: null };
    case actionTypes.shortenSucceeded: {
      const history = [action.payload, ...state.history.filter((i) => i.shortCode !== action.payload.shortCode)].slice(0, 10);
      saveHistory(history);
      return {
        ...state,
        status: 'succeeded',
        history,
        result: action.payload,
      };
    }
    case actionTypes.shortenFailed:
      return { ...state, status: 'failed', error: action.payload };
    case actionTypes.clearResult:
      return { ...state, result: null };
    case actionTypes.deleteHistoryItem: {
      const history = state.history.filter((item) => item.id !== action.payload);
      saveHistory(history);
      return { ...state, history };
    }
    case actionTypes.clearHistory: {
      saveHistory([]);
      return { ...state, history: [] };
    }
    default:
      return state;
  }
};

