import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  urlReducer,
  shortenRequested,
  shortenSucceeded,
  shortenFailed,
  clearResult,
  deleteHistoryItem,
  clearHistory,
  loadInitialHistory,
} from './urlSlice.js';

describe('urlSlice reducer and actions', () => {
  const dummyEntry = {
    id: 12345,
    originalURL: 'https://github.com',
    shortURL: 'http://localhost:3000/git123',
    shortCode: 'git123',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('should handle shortenRequested', () => {
    const prevState = { history: [], result: null, error: 'Previous error', status: 'idle' };
    const nextState = urlReducer(prevState, shortenRequested());

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('should handle shortenSucceeded and prepend to history', () => {
    const prevState = { history: [], result: null, error: null, status: 'loading' };
    const nextState = urlReducer(prevState, shortenSucceeded(dummyEntry));

    expect(nextState.status).toBe('succeeded');
    expect(nextState.result).toEqual(dummyEntry);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0]).toEqual(dummyEntry);
  });

  it('should limit history to 10 entries', () => {
    const existingHistory = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      shortCode: `code_${i}`,
      originalURL: `https://example.com/${i}`,
      shortURL: `http://localhost:3000/code_${i}`,
    }));

    const prevState = { history: existingHistory, result: null, error: null, status: 'idle' };
    const nextState = urlReducer(prevState, shortenSucceeded(dummyEntry));

    expect(nextState.history).toHaveLength(10);
    expect(nextState.history[0]).toEqual(dummyEntry);
  });

  it('should handle shortenFailed', () => {
    const prevState = { history: [], result: null, error: null, status: 'loading' };
    const nextState = urlReducer(prevState, shortenFailed('Invalid URL'));

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Invalid URL');
  });

  it('should handle clearResult', () => {
    const prevState = { history: [], result: dummyEntry, error: null, status: 'succeeded' };
    const nextState = urlReducer(prevState, clearResult());

    expect(nextState.result).toBeNull();
  });

  it('should handle deleteHistoryItem', () => {
    const prevState = {
      history: [dummyEntry, { ...dummyEntry, id: 999, shortCode: 'other' }],
      result: null,
      error: null,
      status: 'idle',
    };
    const nextState = urlReducer(prevState, deleteHistoryItem(12345));

    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0].id).toBe(999);
  });

  it('should handle clearHistory', () => {
    const prevState = {
      history: [dummyEntry],
      result: null,
      error: null,
      status: 'idle',
    };
    const nextState = urlReducer(prevState, clearHistory());

    expect(nextState.history).toEqual([]);
  });

  it('loadInitialHistory safely returns empty array on corrupted localStorage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => '{ corrupt json !!',
    });

    const result = loadInitialHistory();
    expect(result).toEqual([]);
  });
});
