import * as admin from 'firebase-admin';

/**
 * Normalizes an Adzuna API job result to the app's Job type.
 *
 * TODO: Map all Adzuna fields to the Job interface
 */
export function normalizeJob(adzunaJob: Record<string, any>) {
  return {
    sourceId: String(adzunaJob.id || ''),
    title: adzunaJob.title || '',
    company: adzunaJob.company?.display_name || 'Unknown',
    location: {
      city: adzunaJob.location?.area?.[2] || '',
      state: adzunaJob.location?.area?.[1] || '',
      country: adzunaJob.location?.area?.[0] || 'US',
      isRemote: /remote/i.test(adzunaJob.title + ' ' + (adzunaJob.description || '')),
    },
    description: adzunaJob.description || '',
    descriptionSnippet: (adzunaJob.description || '').slice(0, 200),
    salary: {
      min: adzunaJob.salary_min || null,
      max: adzunaJob.salary_max || null,
      currency: 'USD',
      period: 'yearly' as const,
    },
    type: 'full-time' as const, // TODO: Map from Adzuna category/contract_type
    level: 'mid' as const, // TODO: Infer from title keywords
    category: adzunaJob.category?.label || '',
    tags: [] as string[], // TODO: Extract from description using NLP
    applyUrl: adzunaJob.redirect_url || '',
    sourceUrl: adzunaJob.redirect_url || '',
    postedAt: adzunaJob.created
      ? admin.firestore.Timestamp.fromDate(new Date(adzunaJob.created))
      : admin.firestore.FieldValue.serverTimestamp(),
    fetchedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null,
    isActive: true,
  };
}
