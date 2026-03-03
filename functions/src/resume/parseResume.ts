import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Cloud Function: Extracts text from an uploaded resume file.
 *
 * Accepts .docx, .doc, .rtf, .pdf files.
 * Max size: 10 MB
 *
 * TODO: Implement actual parsing:
 *   - Use `mammoth` for .docx → text
 *   - Use `pdf-parse` for .pdf → text
 *   - Use LibreOffice headless for .doc/.rtf → .docx → text
 */
export const extractResume = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  }

  const { fileName } = data;
  functions.logger.info(`Extracting resume: ${fileName} for user ${context.auth.uid}`);

  // TODO: Implement real file parsing
  // For now, return placeholder response
  return {
    success: true,
    text: 'Placeholder resume text. Connect a real parser to extract content from uploaded files.',
    wordCount: 10,
    detectedSections: ['summary', 'experience', 'education', 'skills'],
  };
});
