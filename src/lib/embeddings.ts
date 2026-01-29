import { vectorIndex } from './upstash';
import { HfInference } from '@huggingface/inference';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const EMBEDDING_DIMENSIONS = 384; // all-MiniLM-L6-v2 uses 384 dimensions
const INDEX_DIMENSIONS = 1536; // Matching user's Upstash config

const hf = new HfInference(HF_API_KEY);

export interface UniversityDocument {
  id: string;
  name: string;
  country: string;
  location: string;
  rank: number | null;
  tuition: number;
  acceptanceRate: string;
  programs: string[];
  description: string;
  risks: string[];
  strengths: string[];
  tags: string[];
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    console.log(`🔄 [Embeddings] Generating embedding for text (${text.length} chars)`);

    const output = await hf.featureExtraction({
      model: HF_EMBEDDING_MODEL,
      inputs: text,
    });

    // HF SDK returns the embedding directly as an array
    let embedding: number[];

    if (Array.isArray(output)) {
      // If it's already a flat array
      if (typeof output[0] === 'number') {
        embedding = output as number[];
      } else {
        // If it's a nested array (batch), take first element
        embedding = (output as number[][])[0];
      }
    } else {
      throw new Error('Unexpected embedding format from HuggingFace');
    }

    console.log(`✅ [Embeddings] Generated embedding with ${embedding.length} dimensions`);

    // Pad or truncate to match Upstash index dimensions
    if (embedding.length < INDEX_DIMENSIONS) {
      const padded = new Array(INDEX_DIMENSIONS).fill(0);
      embedding.forEach((val, idx) => {
        padded[idx] = val;
      });
      return padded;
    } else if (embedding.length > INDEX_DIMENSIONS) {
      return embedding.slice(0, INDEX_DIMENSIONS);
    }

    return embedding;
  } catch (error: any) {
    console.error('❌ [Embeddings] Error generating embedding:', error.message);
    console.warn('⚠️ [Embeddings] Falling back to dummy embeddings');

    // Deterministic dummy embeddings for dev stability
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dummy = Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) => Math.sin(hash + i) * 0.1);
    const padded = new Array(INDEX_DIMENSIONS).fill(0);
    dummy.forEach((v, i) => padded[i] = v);
    return padded;
  }
}

export function createUniversityDocument(university: UniversityDocument): string {
  return `
University: ${university.name}
Location: ${university.location}, ${university.country}
Rank: ${university.rank || 'Unranked'}
Tuition: $${university.tuition}/year
Acceptance Rate: ${university.acceptanceRate}
Programs: ${university.programs.join(', ')}
Category: ${university.tags.join(', ')}

Description: ${university.description}

Strengths:
${university.strengths.map(s => `- ${s}`).join('\n')}

Risks:
${university.risks.map(r => `- ${r}`).join('\n')}
  `.trim();
}

export async function indexUniversity(university: UniversityDocument) {
  const document = createUniversityDocument(university);
  const embedding = await generateEmbedding(document);

  await vectorIndex.upsert([{
    id: university.id,
    vector: embedding,
    metadata: {
      name: university.name,
      country: university.country,
      rank: university.rank || 999,
      tuition: university.tuition,
      acceptanceRate: university.acceptanceRate,
      programs: university.programs.join(', '),
      category: university.tags[0] || 'Target',
      strengths: university.strengths.join(' | '),
      risks: university.risks.join(' | '),
    },
  }]);
}

export async function semanticUniversitySearch(
  query: string,
  userProfile: any,
  topK: number = 10
): Promise<any[]> {
  const enhancedQuery = buildSearchQuery(query, userProfile);
  const queryEmbedding = await generateEmbedding(enhancedQuery);

  const results = await vectorIndex.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    includeVectors: false,
  });

  return results.map(result => {
    const metadata = result.metadata || {};
    return {
      id: result.id,
      score: result.score,
      ...metadata,
      strengths: (typeof metadata.strengths === 'string' && metadata.strengths.trim() !== '') ? metadata.strengths.split(' | ') : [],
      risks: (typeof metadata.risks === 'string' && metadata.risks.trim() !== '') ? metadata.risks.split(' | ') : [],
    };
  });
}

function buildSearchQuery(query: string, userProfile: any): string {
  const profileContext = `
Student Profile:
- GPA: ${userProfile.gpa || 'N/A'}
- Budget: $${userProfile.budgetMax || 0}/year
- Target Field: ${userProfile.targetField || 'Not specified'}
- Preferred Countries: ${userProfile.preferredCountries?.join(', ') || 'Any'}
- Study Goal: ${userProfile.studyGoal || 'Not specified'}

Query: ${query}
  `.trim();

  return profileContext;
}

export async function generateUniversityRecommendations(userProfile: any): Promise<any[]> {
  const query = `
Find universities for ${userProfile.studyGoal || 'graduate studies'} in ${userProfile.targetField || 'any field'}
with tuition under $${userProfile.budgetMax || 50000} per year in ${userProfile.preferredCountries?.join(' or ') || 'any country'}.
Student has GPA ${userProfile.gpa || 'average'}.
  `.trim();

  return await semanticUniversitySearch(query, userProfile, 20);
}

// Helper utilities for dimension matching and fallbacks
function padOrTruncateEmbedding(embedding: number[], dimensions: number): number[] {
  if (embedding.length < dimensions) {
    const padded = new Array(dimensions).fill(0);
    embedding.forEach((v, i) => padded[i] = v);
    return padded;
  }
  return embedding.slice(0, dimensions);
}

function generateDummyEmbedding(text: string, dimensions: number): number[] {
  // Deterministic dummy embedding based on text hash
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dummy = Array.from({ length: dimensions }, (_, i) => Math.sin(hash + i) * 0.1);
  return dummy;
}
