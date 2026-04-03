import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDapRecordsFromFile, normalizeDapRecords, getNormalizedTopPages } from '../../src/ingest/dap-source.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(currentDir, '../fixtures/dap-sample.json');

test('readDapRecordsFromFile reads fixture payload', async () => {
  const records = await readDapRecordsFromFile(fixturePath);
  assert.equal(records.length, 6);
});

test('normalizeDapRecords sorts by load desc and url asc tie-break', async () => {
  const records = await readDapRecordsFromFile(fixturePath);
  const normalized = normalizeDapRecords(records, {
    limit: 4,
    sourceDate: '2026-02-21'
  });

  assert.equal(normalized.records.length, 4);
  assert.equal(normalized.records[0].url, 'https://example.gov/a');
  assert.equal(normalized.records[1].url, 'https://example.gov/b');
  assert.equal(normalized.records[2].url, 'https://example.gov/c');
  assert.equal(normalized.records[3].url, 'https://example.gov/d');
});

test('normalizeDapRecords flags missing page load counts', async () => {
  const records = await readDapRecordsFromFile(fixturePath);
  const normalized = normalizeDapRecords(records, {
    limit: 10,
    sourceDate: '2026-02-21'
  });

  assert.ok(normalized.warnings.some((warning) => warning.code === 'missing_page_load_count'));
});

test('getNormalizedTopPages supports file-based ingest path', async () => {
  const result = await getNormalizedTopPages({
    sourceFile: fixturePath,
    limit: 3,
    sourceDate: '2026-02-21'
  });

  assert.equal(result.records.length, 3);
  assert.equal(result.records[0].source_date, '2026-02-21');
});

test('normalizeDapRecords filters out DAP placeholder entries like (other)', () => {
  const records = [
    { url: 'https://example.gov', page_load_count: 5000 },
    { url: '(other)', page_load_count: 2000000 },
    { url: 'https://(other)', page_load_count: 1500000 }
  ];
  const normalized = normalizeDapRecords(records, { limit: 10, sourceDate: '2026-03-01' });

  assert.equal(normalized.records.length, 1, 'Should only keep real URLs');
  assert.equal(normalized.records[0].url, 'https://example.gov');
  assert.equal(normalized.excluded.filter((e) => e.reason === 'placeholder_url').length, 2, 'Should exclude both placeholder entries');
});

test('getNormalizedTopPages forwards limit as a query param to the API endpoint', async () => {
  let capturedUrl = null;
  const mockFetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => [{ url: 'https://nsf.gov/', page_load_count: 100 }]
    };
  };

  await getNormalizedTopPages({
    endpoint: 'https://api.gsa.gov/analytics/dap/v2/domain/nsf.gov/reports/site/data',
    limit: 250,
    sourceDate: '2026-04-03',
    fetchImpl: mockFetch
  });

  const parsed = new URL(capturedUrl);
  assert.equal(parsed.searchParams.get('limit'), '250', 'limit should be forwarded as a query param');
  assert.equal(parsed.searchParams.get('after'), '2026-04-02', 'after should be the day before sourceDate');
});

test('getNormalizedTopPages does not override a limit already present in the endpoint URL', async () => {
  let capturedUrl = null;
  const mockFetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => [{ url: 'https://nsf.gov/', page_load_count: 100 }]
    };
  };

  await getNormalizedTopPages({
    endpoint: 'https://api.gsa.gov/analytics/dap/v2/domain/nsf.gov/reports/site/data?limit=50',
    limit: 250,
    sourceDate: '2026-04-03',
    fetchImpl: mockFetch
  });

  const parsed = new URL(capturedUrl);
  assert.equal(parsed.searchParams.get('limit'), '50', 'pre-set limit in the URL should not be overridden');
});

test('getNormalizedTopPages supports analytics.usa.gov-style data via mock fetch', async () => {
  const analyticsPayload = {
    data: [
      { page: 'nsf.gov/', pageviews: '5000' },
      { page: 'nsf.gov/about', pageviews: '3000' },
      { page: 'nsf.gov/funding', pageviews: '1000' }
    ]
  };

  const mockFetch = async () => ({
    ok: true,
    json: async () => analyticsPayload
  });

  const result = await getNormalizedTopPages({
    endpoint: 'https://analytics.usa.gov/data/live/national-science-foundation/top-pages-7-days.json',
    limit: 10,
    sourceDate: '2026-04-03',
    fetchImpl: mockFetch
  });

  assert.equal(result.records.length, 3);
  assert.equal(result.records[0].url, 'https://nsf.gov/');
  assert.equal(result.records[0].page_load_count, 5000);
  assert.equal(typeof result.records[0].page_load_count, 'number');
  assert.equal(result.records[1].url, 'https://nsf.gov/about');
});

test('getNormalizedTopPages does not override after if already in endpoint URL', async () => {
  let capturedUrl = null;
  const mockFetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => [{ url: 'https://nsf.gov/', page_load_count: 100 }]
    };
  };

  await getNormalizedTopPages({
    endpoint: 'https://api.gsa.gov/analytics/dap/v2/domain/nsf.gov/reports/site/data?after=2026-03-01',
    limit: 50,
    sourceDate: '2026-04-03',
    fetchImpl: mockFetch
  });

  const parsed = new URL(capturedUrl);
  assert.equal(parsed.searchParams.get('after'), '2026-03-01', 'pre-set after in URL should not be overridden');
});

test('getNormalizedTopPages omits after param when sourceDate is not provided', async () => {
  let capturedUrl = null;
  const mockFetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => [{ url: 'https://nsf.gov/', page_load_count: 100 }]
    };
  };

  await getNormalizedTopPages({
    endpoint: 'https://api.gsa.gov/analytics/dap/v2/domain/nsf.gov/reports/site/data',
    limit: 50,
    fetchImpl: mockFetch
  });

  const parsed = new URL(capturedUrl);
  assert.equal(parsed.searchParams.has('after'), false, 'after should not be added when sourceDate is absent');
});

test('getNormalizedTopPages includes api_key in the DAP endpoint request when provided', async () => {
  let capturedUrl = null;
  const mockFetch = async (url) => {
    capturedUrl = url;
    return {
      ok: true,
      json: async () => [{ url: 'https://nsf.gov/', page_load_count: 100 }]
    };
  };

  await getNormalizedTopPages({
    endpoint: 'https://api.gsa.gov/analytics/dap/v2/domain/nsf.gov/reports/site/data',
    limit: 50,
    dapApiKey: 'DEMO_KEY',
    fetchImpl: mockFetch
  });

  const parsed = new URL(capturedUrl);
  assert.equal(parsed.searchParams.get('api_key'), 'DEMO_KEY', 'api_key should be appended to the DAP endpoint URL');
});
