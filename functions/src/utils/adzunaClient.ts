import * as functions from 'firebase-functions';

/**
 * Adzuna API HTTP client with retry and rate limiting.
 *
 * TODO: Connect Adzuna API credentials
 * Environment variables:
 *   ADZUNA_APP_ID=<your_app_id>
 *   ADZUNA_APP_KEY=<your_app_key>
 *   ADZUNA_BASE_URL=https://api.adzuna.com/v1/api/jobs
 *   ADZUNA_COUNTRY=us
 */

const BASE_URL = process.env.ADZUNA_BASE_URL || 'https://api.adzuna.com/v1/api/jobs';
const COUNTRY = process.env.ADZUNA_COUNTRY || 'us';
const APP_ID = process.env.ADZUNA_APP_ID || '';
const APP_KEY = process.env.ADZUNA_APP_KEY || '';

interface AdzunaSearchParams {
  what: string;
  where?: string;
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
  fullTime?: boolean;
  partTime?: boolean;
  contract?: boolean;
  page?: number;
  resultsPerPage?: number;
}

export async function searchJobs(params: AdzunaSearchParams): Promise<any> {
  if (!APP_ID || !APP_KEY) {
    functions.logger.warn('Adzuna API credentials not configured. Returning empty results.');
    return { results: [], count: 0 };
  }

  const queryParams = new URLSearchParams({
    app_id: APP_ID,
    app_key: APP_KEY,
    what: params.what,
    results_per_page: String(params.resultsPerPage || 50),
    page: String(params.page || 1),
  });

  if (params.where) queryParams.set('where', params.where);
  if (params.salaryMin) queryParams.set('salary_min', String(params.salaryMin));
  if (params.salaryMax) queryParams.set('salary_max', String(params.salaryMax));
  if (params.fullTime) queryParams.set('full_time', '1');
  if (params.partTime) queryParams.set('part_time', '1');
  if (params.contract) queryParams.set('contract', '1');

  const url = `${BASE_URL}/${COUNTRY}/search/1?${queryParams.toString()}`;

  // TODO: Add retry logic and error handling
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
