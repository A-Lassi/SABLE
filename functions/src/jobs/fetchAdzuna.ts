import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scheduled Cloud Function: Fetches jobs from Adzuna API weekly.
 * Trigger: Cloud Scheduler (every Sunday at 2:00 AM UTC)
 *
 * TODO: Connect Adzuna API key
 * Environment variables needed:
 *   ADZUNA_APP_ID=<your_app_id>
 *   ADZUNA_APP_KEY=<your_app_key>
 *   ADZUNA_BASE_URL=https://api.adzuna.com/v1/api/jobs
 */
export const fetchJobPool = functions.pubsub
  .schedule('every sunday 02:00')
  .timeZone('UTC')
  .onRun(async () => {
    functions.logger.info('Starting weekly job pool fetch...');

    // TODO: Implement Adzuna API integration
    // 1. Read user preference aggregates (popular roles, locations)
    // 2. Make paginated Adzuna API calls for each role/location combo
    // 3. Normalize each result via normalizeJob()
    // 4. Deduplicate against existing jobs collection by sourceId
    // 5. Write new jobs; mark expired jobs as isActive: false
    // 6. Update systemConfig/adzuna with fetch metadata

    const configRef = db.collection('systemConfig').doc('adzuna');
    await configRef.set(
      {
        lastFetchAt: admin.firestore.FieldValue.serverTimestamp(),
        lastFetchCount: 0,
        dailyApiCalls: 0,
        dailyCapReached: false,
      },
      { merge: true }
    );

    functions.logger.info('Job pool fetch complete (placeholder).');
  });
