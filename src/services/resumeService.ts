import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { storage, functions } from './firebase';
import type { ResumeExtractResponse, ResumeTailorRequest, ResumeTailorResponse } from '../types';

const USE_MOCK = true; // TODO: Set to false when Firebase is connected

export async function uploadResume(uid: string, file: File): Promise<string> {
  if (USE_MOCK) {
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1500));
    return `resumes/${uid}/master.${file.name.split('.').pop()}`;
  }

  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `resumes/${uid}/master.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function extractResume(file: File): Promise<ResumeExtractResponse> {
  if (USE_MOCK) {
    // Simulate extraction delay
    await new Promise((r) => setTimeout(r, 2000));
    return {
      success: true,
      text: 'PROFESSIONAL SUMMARY\nExperienced software engineer with 5+ years...\n\nEXPERIENCE\nSenior Developer — TechCo (2021–Present)\n• Led team of 5 engineers\n• Built scalable microservices\n\nEDUCATION\nB.S. Computer Science — University (2019)\n\nSKILLS\nReact, TypeScript, Node.js, Python, AWS',
      wordCount: 42,
      detectedSections: ['summary', 'experience', 'education', 'skills'],
    };
  }

  // TODO: Call Cloud Function endpoint
  const extractFn = httpsCallable<{ fileName: string }, ResumeExtractResponse>(
    functions,
    'extractResume'
  );
  const result = await extractFn({ fileName: file.name });
  return result.data;
}

export async function tailorResume(request: ResumeTailorRequest): Promise<ResumeTailorResponse> {
  if (USE_MOCK) {
    // Simulate LLM tailoring delay
    await new Promise((r) => setTimeout(r, 3000));
    return {
      success: true,
      tailoredResume:
        'PROFESSIONAL SUMMARY\nResults-driven software engineer specializing in building high-performance web applications. Expert in React, TypeScript, and modern frontend architectures with a passion for creating seamless user experiences.\n\nEXPERIENCE\nSenior Frontend Developer — TechCo (2021–Present)\n• Architected and built React + TypeScript SPA serving 50k+ daily users\n• Led migration from legacy codebase, improving page load times by 40%\n• Mentored 3 junior developers through structured code reviews\n\nFrontend Developer — WebAgency (2019–2021)\n• Built responsive web applications for enterprise clients\n• Implemented CI/CD pipelines reducing deployment time by 60%\n\nEDUCATION\nB.S. Computer Science — University (2019)\n\nSKILLS\nReact, TypeScript, Node.js, GraphQL, Tailwind CSS, Jest, Cypress, AWS',
      changes: [
        { section: 'summary', type: 'reworded', description: 'Aligned summary with job focus on frontend development' },
        { section: 'experience', type: 'reordered', description: 'Prioritized frontend-specific achievements' },
        { section: 'skills', type: 'reworded', description: 'Highlighted relevant technologies from job description' },
      ],
    };
  }

  // TODO: Call Cloud Function endpoint
  const tailorFn = httpsCallable<ResumeTailorRequest, ResumeTailorResponse>(
    functions,
    'tailorResume'
  );
  const result = await tailorFn(request);
  return result.data;
}
