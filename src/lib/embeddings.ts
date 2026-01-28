import { vectorIndex } from './upstash';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_EMBEDDING_MODEL = 'Qwen/Qwen3-Embedding-8B';
const EMBEDDING_DIMENSIONS = 1024;
const INDEX_DIMENSIONS = 1536; // Matching user's Upstash config

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
    const response = await fetch(
      `https://router.huggingface.co/models/${HF_EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true,
            use_cache: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Embeddings] HF Error: ${response.status}`, errorText);
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    let embedding = await response.json();

    // Normalize response formats
    if (Array.isArray(embedding)) {
      // E5 models often return [ [ [vector] ] ] or similar
      let result = embedding;
      while (Array.isArray(result[0])) {
        result = result[0];
      }

      // If it's the first element of a larger response
      if (Array.isArray(embedding[0]) && embedding[0].length === EMBEDDING_DIMENSIONS) result = embedding[0];

      // Pad to INDEX_DIMENSIONS (1536) to match user's Upstash config
      if (result.length < INDEX_DIMENSIONS) {
        const padded = new Array(INDEX_DIMENSIONS).fill(0);
        result.forEach((v: number, i: number) => padded[i] = v);
        return padded;
      }
      return result;
    }

    throw new Error('Unexpected embedding format from HuggingFace');
  } catch (error) {
    console.warn('⚠️ [Embeddings] Falling back to dummy embeddings:', error);
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

  return results.map(result => ({
    id: result.id,
    score: result.score,
    ...result.metadata,
  }));
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
