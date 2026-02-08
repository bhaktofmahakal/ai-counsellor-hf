




















GET /api/conversations?userId=cmkwknf0g0000k965egawmfmv 200 in 347ms
 GET /api/auth/session 200 in 532ms
 GET /api/auth/session 200 in 440ms
 GET /dashboard/universities 200 in 164ms
 ○ Compiling /api/universities ...
 ✓ Compiled /api/universities in 537ms (1104 modules)
🔍 [API/Universities] Query - RAG: true, Country: null, Search: null, User: feedthequantum@gmail.com
🤖 [API/Universities] Using RAG for user: cmkwknf0g0000k965egawmfmv
❌ [Embeddings] HF Error: 400 Bad Request {"error":"SentenceSimilarityPipeline.__call__() missing 1 required positional argument: 'sentences'"}
❌ [API/Universities] Error fetching universities: Error: HuggingFace API error: 400 Bad Request
    at generateEmbedding (src\lib\embeddings.ts:41:11)        
    at async semanticUniversitySearch (src\lib\embeddings.ts:93:26)
    at async generateUniversityRecommendations (src\lib\embeddings.ts:131:10)
    at async GET (src\app\api\universities\route.ts:44:33)    
  39 |     const errorText = await response.text();
  40 |     console.error(`❌ [Embeddings] HF Error: ${response.status} ${response.statusText}`, errorText);
> 41 |     throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
     |           ^
  42 |   }
  43 |
  44 |   const embedding = await response.json();
 GET /api/universities?userEmail=feedthequantum%40gmail.com&rag=true 200 in 2397ms
🔍 [API/Universities] Query - RAG: true, Country: null, Search: null, User: feedthequantum@gmail.com
🤖 [API/Universities] Using RAG for user: cmkwknf0g0000k965egawmfmv
❌ [Embeddings] HF Error: 400 Bad Request {"error":"SentenceSimilarityPipeline.__call__() missing 1 required positional argument: 'sentences'"}
❌ [API/Universities] Error fetching universities: Error: HuggingFace API error: 400 Bad Request
    at generateEmbedding (src\lib\embeddings.ts:41:11)        
    at async semanticUniversitySearch (src\lib\embeddings.ts:93:26)
    at async generateUniversityRecommendations (src\lib\embeddings.ts:131:10)
    at async GET (src\app\api\universities\route.ts:44:33)    
  39 |     const errorText = await response.text();
  40 |     console.error(`❌ [Embeddings] HF Error: ${response.status} ${response.statusText}`, errorText);
> 41 |     throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
     |           ^
  42 |   }
  43 |
  44 |   const embedding = await response.json();
 GET /api/universities?userEmail=feedthequantum%40gmail.com&rag=true 200 in 949ms
 GET /dashboard 200 in 133ms
 GET /api/auth/session 200 in 950ms
 GET /api/auth/session 200 in 396ms
 ○ Compiling /dashboard/onboarding ...
 ✓ Compiled /dashboard/onboarding in 3.2s (1812 modules)
 GET /dashboard/onboarding 200 in 3561ms
 GET /dashboard/onboarding 200 in 95ms
 ○ Compiling /api/user ...
 ✓ Compiled /api/user in 622ms (1105 modules)
🔄 [API/User] Upserting user: feedthequantum@gmail.com
✅ [API/User] User upserted: cmkwknf0g0000k965egawmfmv
✅ [API/User] Recalculated match scores for: cmkwknf0g0000k965egawmfmv
 PATCH /api/user 200 in 2188ms
 GET /dashboard 200 in 168ms
 GET /dashboard/ai-counsellor 200 in 90ms
 ✓ Compiled /api/conversations in 425ms (1107 modules)
 GET /dashboard/tasks 200 in 122ms
✅ [API/Conversations] Fetched 2 messages for user: cmkwknf0g0000k965egawmfmv
 GET /api/conversations?userId=cmkwknf0g0000k965egawmfmv 200 in 894ms
✅ [API/Conversations] Fetched 2 messages for user: cmkwknf0g0000k965egawmfmv
 GET /api/conversations?userId=cmkwknf0g0000k965egawmfmv 200 in 374ms
 GET /dashboard/universities 200 in 78ms
 ✓ Compiled /api/universities in 458ms (1117 modules)
🔍 [API/Universities] Query - RAG: true, Country: null, Search: null, User: feedthequantum@gmail.com
🤖 [API/Universities] Using RAG for user: cmkwknf0g0000k965egawmfmv
❌ [Embeddings] HF Error: 400 Bad Request {"error":"SentenceSimilarityPipeline.__call__() missing 1 required positional argument: 'sentences'"}
❌ [API/Universities] Error fetching universities: Error: HuggingFace API error: 400 Bad Request
    at generateEmbedding (src\lib\embeddings.ts:41:11)        
    at async semanticUniversitySearch (src\lib\embeddings.ts:93:26)
    at async generateUniversityRecommendations (src\lib\embeddings.ts:131:10)
    at async GET (src\app\api\universities\route.ts:44:33)    
  39 |     const errorText = await response.text();
  40 |     console.error(`❌ [Embeddings] HF Error: ${response.status} ${response.statusText}`, errorText);
> 41 |     throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
     |           ^
  42 |   }
  43 |
  44 |   const embedding = await response.json();
 GET /api/universities?userEmail=feedthequantum%40gmail.com&rag=true 200 in 1786ms
🔍 [API/Universities] Query - RAG: true, Country: null, Search: null, User: feedthequantum@gmail.com
🤖 [API/Universities] Using RAG for user: cmkwknf0g0000k965egawmfmv
🔍 [API/Universities] Query - RAG: false, Country: null, Search: null, User: feedthequantum@gmail.com
✅ [API/Universities] Cache hit: 0 universities
 GET /api/universities?userEmail=feedthequantum%40gmail.com 200 in 100ms
❌ [Embeddings] HF Error: 400 Bad Request {"error":"SentenceSimilarityPipeline.__call__() missing 1 required positional argument: 'sentences'"}
❌ [API/Universities] Error fetching universities: Error: HuggingFace API error: 400 Bad Request
    at generateEmbedding (src\lib\embeddings.ts:41:11)        
    at async semanticUniversitySearch (src\lib\embeddings.ts:93:26)
    at async generateUniversityRecommendations (src\lib\embeddings.ts:131:10)
    at async GET (src\app\api\universities\route.ts:44:33)    
  39 |     const errorText = await response.text();
  40 |     console.error(`❌ [Embeddings] HF Error: ${response.status} ${response.statusText}`, errorText);
> 41 |     throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
     |           ^
  42 |   }
  43 |
  44 |   const embedding = await response.json();
 GET /api/universities?userEmail=feedthequantum%40gmail.com&rag=true 200 in 856ms
🔍 [API/Universities] Query - RAG: true, Country: null, Search: null, User: feedthequantum@gmail.com
🤖 [API/Universities] Using RAG for user: cmkwknf0g0000k965egawmfmv
❌ [Embeddings] HF Error: 400 Bad Request {"error":"SentenceSimilarityPipeline.__call__() missing 1 required positional argument: 'sentences'"}
❌ [API/Universities] Error fetching universities: Error: HuggingFace API error: 400 Bad Request
    at generateEmbedding (src\lib\embeddings.ts:41:11)        
    at async semanticUniversitySearch (src\lib\embeddings.ts:93:26)
    at async generateUniversityRecommendations (src\lib\embeddings.ts:131:10)
    at async GET (src\app\api\universities\route.ts:44:33)    
  39 |     const errorText = await response.text();
  40 |     console.error(`❌ [Embeddings] HF Error: ${response.status} ${response.statusText}`, errorText);
> 41 |     throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
     |           ^
  42 |   }
  43 |
  44 |   const embedding = await response.json();
 GET /api/universities?userEmail=feedthequantum%40gmail.com&rag=true 200 in 864ms


university api work nhi kr rhi h kya

ai rag search work nhi kr rha standard search work nhi kr rha

profile update krne pr update nhi hota h kyoki refesh krne pr apne app phir se vaise hi ho jata h 
google login taking so much time ? why 
koi bhi feature dhng s nhi h jo work kre 
can you identify these mand make these worked








## backend and platfrom polish 

supabase cloud database 

password of supabase: 
utsavmishra123
Project API
Your API is secured behind an API gateway which requires an API Key for every request.
You can use the parameters below to use Supabase client libraries.

Project URL
https://jnkijrazsvxhrfxfnyxi.supabase.co

Copy
A RESTful endpoint for querying and managing your database.

Publishable API Key
sb_publishable_eIHGhTZ-4-Z6UZfqj9Rpvg_X2HAoEDv


https://jnkijrazsvxhrfxfnyxi.supabase.co
sb_publishable_eIHGhTZ-4-Z6UZfqj9Rpvg_X2HAoEDv
ANON KEY :- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2lqcmF6c3Z4aHJmeGZueXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MDM5NDEsImV4cCI6MjA4NTA3OTk0MX0.vab_gFpL5EJG26zyGdBFnoMyHzLVS_f7VFPlNsFyMGw


NEXT_PUBLIC_SUPABASE_URL=https://jnkijrazsvxhrfxfnyxi.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_eIHGhTZ-4-Z6UZfqj9Rpvg_X2HAoEDv


# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.jnkijrazsvxhrfxfnyxi:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.jnkijrazsvxhrfxfnyxi:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"



generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
        

Get the connection strings and environment variables for your app.

Connection String
App Frameworks
Mobile Frameworks
ORMs
API Keys
MCP
Type

URI
Source

Primary database
Method

Direct connection
Learn how to connect to your Postgres databases.
Read docs

Direct connection
Ideal for applications with persistent and long-lived connections, such as those running on virtual machines or long-standing containers.

postgresql://postgres:[YOUR-PASSWORD]@db.jnkijrazsvxhrfxfnyxi.supabase.co:5432/postgres


View parameters
Not IPv4 compatible
Use Session Pooler if on a IPv4 network or purchase IPv4 add-on
IPv4 add-on
Pooler settings

Some platforms are IPv4-only:
A few major platforms are IPv4-only and may not work with a Direct Connection:

Vercel
GitHub Actions
Render
Retool
If you wish to use a Direct Connection with these, please purchase IPv4 support.

You may also use the Session Pooler or Transaction Pooler if you are on a IPv4 network.




Type

URI
Source

Primary database
Method

Session pooler
Learn how to connect to your Postgres databases.
Read docs

Session pooler
Shared Pooler
Only recommended as an alternative to Direct Connection, when connecting via an IPv4 network.

postgresql://postgres.jnkijrazsvxhrfxfnyxi:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres


View parameters
IPv4 compatible
Session pooler connections are IPv4 proxied for free
Only use on a IPv4 network
Session pooler connections are IPv4 proxied for free.

Use Direct Connection if connecting via an IPv6 network.

Reset your database password

You may reset your database password in your project's Database Settings


### section 2 

Alibaba Cloud
Canopy Labs
Groq
Meta
Moonshot AI
OpenAI
not using gemini 
using groq cloud api  that have many models use suitable for this platform 

API key :- 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




## section problem 3 university apis 

🎓 University Data & APIs - Free Resources

✅ BEST FREE OPTIONS
1. GitHub University Datasets (Recommended ⭐)
bash# Best options for your hackathon:

1. "Hipo/university-domains-list"
   - 9000+ universities worldwide
   - Free, no API key needed
   - JSON format
   - Has: name, domain, country, website
   
2. "universities-data" repositories
   - Curated lists with logos
   - University rankings
   - Course information
Usage:
typescript// Direct JSON import
import universities from './data/universities.json'

// Or fetch from GitHub
const response = await fetch(
  'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
)
const universities = await response.json()

2. Free University APIs
A. Universities Hipolabs API ⭐ (Best for hackathon)
bashBase URL: http://universities.hipolabs.com/search

# Examples:
# Search by country
http://universities.hipolabs.com/search?country=United+States

# Search by name
http://universities.hipolabs.com/search?name=Stanford

# Get all universities
http://universities.hipolabs.com/search
Response Format:
json[
  {
    "name": "Stanford University",
    "country": "United States",
    "alpha_two_code": "US",
    "web_pages": ["http://www.stanford.edu"],
    "domains": ["stanford.edu"],
    "state-province": "California"
  }
]
Usage in your app:
typescript// lib/universityApi.ts
export async function searchUniversities(country: string) {
  const response = await fetch(
    `http://universities.hipolabs.com/search?country=${country}`
  )
  return response.json()
}

B. QS World Rankings (Web Scraping)
bash# Not an API, but you can scrape or use cached data
Source: https://www.topuniversities.com/university-rankings

# Many GitHub repos have scraped this data already
# Search: "QS rankings dataset github"

3. Wikipedia API (For detailed info)
typescript// Get university info from Wikipedia
async function getUniversityInfo(universityName: string) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${universityName}`
  )
  const data = await response.json()
  return {
    description: data.extract,
    image: data.thumbnail?.source,
    url: data.content_urls.desktop.page
  }
}

// Example:
const info = await getUniversityInfo("Stanford_University")

4. University Logos & Images
Option A: Clearbit Logo API (Free, no auth)
typescript// Get logo from domain
const logoUrl = `https://logo.clearbit.com/${domain}`

// Example:
// https://logo.clearbit.com/stanford.edu
// https://logo.clearbit.com/mit.edu
// https://logo.clearbit.com/harvard.edu
Option B: Google Custom Search API
bash# Free tier: 100 searches/day
# Good for getting university images

API Key needed (free): https://developers.google.com/custom-search
Option C: Manual Collection (Recommended for hackathon)
bash# Create your own curated dataset
# 50-100 top universities
# Download logos from official websites
# Store in /public/universities folder

/public/universities/
  ├── stanford.png
  ├── mit.png
  ├── harvard.png
  └── ...

🗂️ RECOMMENDED STRUCTURE FOR HACKATHON
Create Your Own University Database
typescript// data/universities.ts
export const universities = [
  {
    id: 1,
    name: "Stanford University",
    country: "United States",
    state: "California",
    logo: "/universities/stanford.png",
    website: "https://www.stanford.edu",
    ranking: 5,
    
    // Your custom fields for AI matching
    averageCost: 75000,
    acceptanceRate: 4.3,
    minimumGPA: 3.9,
    minimumIELTS: 7.0,
    minimumGRE: 320,
    
    // Categories
    dreamFor: ["GPA > 3.8", "GRE > 320"],
    targetFor: ["GPA 3.5-3.8", "GRE 310-320"],
    safeFor: [],
    
    // Popular courses
    popularCourses: ["Computer Science", "MBA", "Engineering"],
    
    // Additional info
    description: "World-renowned university in Silicon Valley...",
    campusImage: "/universities/stanford-campus.jpg",
  },
  {
    id: 2,
    name: "University of Toronto",
    country: "Canada",
    state: "Ontario",
    logo: "/universities/toronto.png",
    website: "https://www.utoronto.ca",
    ranking: 34,
    averageCost: 45000,
    acceptanceRate: 43,
    minimumGPA: 3.3,# Upstash Redis (for caching & session management)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Upstash Vector (for RAG embeddings)
UPSTASH_VECTOR_REST_URL=https://xxxxx-xxxxx.upstash.io
UPSTASH_VECTOR_REST_TOKEN=xxxxx

    minimumIELTS: 6.5,
    minimumGRE: 310,
    dreamFor: ["GPA 3.5-3.8"],
    targetFor: ["GPA 3.0-3.5", "GRE 300-310"],
    safeFor: ["GPA > 2]}




## section 4 
Fix profile edit and also reflected to database 

password reset not required remove that or simplaly write in future coming soon


### google auth real creds are in diffrent env file right now 
fix all these 
issues 
## deployment will be on vercel fully platform



### new

HUGGINGFACE API/TOKEN : 
UPSTASH_REDIS_REST_URL="https://correct-polliwog-28271.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AW5vAAIncDI5ODM4N2RkYWJjNDg0YjhkYWE3ZDZjZjZjZWI5Mzg4MXAyMjgyNzE"


import { Redis } from '@upstash/redis'
const redis = new Redis({
  url: 'https://correct-polliwog-28271.upstash.io',
  token: 'AW5vAAIncDI5ODM4N2RkYWJjNDg0YjhkYWE3ZDZjZjZjZWI5Mzg4MXAyMjgyNzE',
})

await redis.set("foo", "bar");
await redis.get("foo");




UPSTASH_VECTOR_REST_URL="https://prompt-mite-85913-us1-vector.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="ABUFMHByb21wdC1taXRlLTg1OTEzLXVzMWFkbWluWlRFNE1UTmtNalV0TTJZNFppMDBZalV6TFdKaVpUQXROelF3WkROalkyUmhZakk1"
Endpoint
https://prompt-mite-85913-us1-vector.upstash.io

TOKEN : ABUFMHByb21wdC1taXRlLTg1OTEzLXVzMWFkbWluWlRFNE1UTmtNalV0TTJZNFppMDBZalV6TFdKaVpUQXROelF3WkROalkyUmhZakk1

from upstash_vector import Index, Vector

index = Index(url="https://prompt-mite-85913-us1-vector.upstash.io", token="ABUFMHByb21wdC1taXRlLTg1OTEzLXVzMWFkbWluWlRFNE1UTmtNalV0TTJZNFppMDBZalV6TFdKaVpUQXROelF3WkROalkyUmhZakk1")

index.upsert(
  vectors=[
    Vector(
      id="id-0",
      vector=[0.76, 0.67, 0.87, 0.11, 0.68, 0.32, 0.47, 0.77, 0.43, 0.33, 0.29, 0.55, 0.54, 0.04, 0.05, 0.94, 0.97, 0.35, 0.02, 0.63, 0.63, 0.92, 0.47, 0.51, 0.37, 0.69, 0.34, 0.32, 0.57, 0.42, 0.84, 0.15, 0.25, 0.5, 0.62, 0.35, 0.97, 0.52, 0.82, 0.51, 0.01, 0.43, 0.67, 0.73, 0.49, 0.73, 0.69, 0.96, 0.66, 0.69, 0.46, 0.05, 0.01, 0.17, 0.35, 0.58, 0.58, 0.81, 0.22, 0.33, 0.56, 0.22, 0.67, 0.87, 0.64, 0.36, 0.1, 0.73, 0.2, 0.44, 0.6, 0.5, 0.72, 0.58, 0.02, 0.18, 0.3, 0.56, 0.05, 0.38, 0.43, 0.74, 0.92, 0.96, 0.02, 0.97, 0.94, 0.79, 0.38, 0.24, 0.95, 0.77, 0.14, 0.93, 0.64, 0.53, 0.2, 0.9, 0.93, 0.54, 0.89, 0.33, 0.14, 0.28, 0.76, 0.68, 0.49, 0.71, 0.37, 0.59, 0.21, 0.29, 0.15, 0.65, 0.02, 0.47, 0.2, 0.32, 0.01, 0.06, 0.02, 0.09, 0.1, 0.81, 0.06, 0.12, 0.69, 0.85, 0.83, 0.3, 0.71, 0.97, 0.47, 0.52, 0.03, 0.06, 0.85, 0.41, 0.39, 0.78, 0.59, 0.25, 0.66, 0.83, 0.01, 0.72, 0.64, 0.41, 0.02, 0.58, 0.02, 0.59, 0.18, 0.72, 0.03, 0.41, 1, 0.81, 0.99, 0.29, 0.47, 0.84, 0.74, 0.48, 0.19, 0.49, 0.26, 0.97, 0.79, 0.49, 0.34, 0.24, 1, 0.25, 0.92, 0.6, 0.82, 0.5, 0.16, 0.98, 0.25, 0.3, 0.31, 0.83, 0.5, 0.8, 0.25, 0.47, 0.27, 0.74, 0.54, 0.38, 0.18, 0.94, 1, 0.47, 0.65, 0.27, 0.39, 0.67, 0.14, 0.29, 0.54, 0.93, 0.6, 0.3, 0.94, 0.87, 0.77, 0.03, 0.94, 0.42, 0.65, 0.18, 0.73, 0.37, 0.1, 1, 0.12, 0.35, 0.51, 0.07, 0.71, 0.75, 0.61, 0.18, 0.16, 0.51, 0.98, 0.86, 0.29, 0.36, 0.19, 0.39, 0.92, 0.94, 0.41, 0.1, 0.34, 0.77, 1, 0.08, 0.53, 0.65, 0.83, 0.25, 0.47, 0.85, 0.63, 0.63, 0.77, 0.99, 0.31, 0.01, 0.49, 0.58, 0.53, 0.07, 0.62, 0.72, 0.59, 0.96, 0.1, 0.84, 0.72, 0.89, 0.05, 0.13, 0.44, 0.86, 0.14, 0.45, 0.19, 0.09, 0.56, 0.12, 0.44, 0.58, 0.1, 0.6, 0.06, 0.72, 0.8, 0.24, 0.35, 0.07, 0.36, 0.21, 0.87, 0.84, 0.74, 0.5, 0.86, 0.9, 0.02, 0.7, 0.36, 0.5, 0.78, 0.34, 0.12, 0.57, 0.36, 0.41, 0.67, 0.24, 0.85, 0.81, 0.55, 0.28, 0.13, 0.41, 0.18, 0.91, 0.71, 0.58, 0.74, 0.02, 0.09, 0.81, 0.22, 0.96, 0.05, 0.83, 0.75, 0.97, 0.01, 0.63, 0.35, 0.13, 0.77, 0.76, 0.72, 0.82, 0.94, 0.35, 0.51, 0.83, 0.96, 0.59, 0.43, 0.06, 0.31, 0.64, 0.85, 0.62, 0.45, 0.48, 0.95, 0.17, 0.93, 0.06, 0.29, 0.03, 0.63, 0.18, 0.37, 0.99, 0.41, 0.47, 0, 0.98, 0.11, 0.5, 0.04, 0.69, 0.6, 0.51, 0.18, 0.77, 0.47, 0.76, 0.34, 0.45, 0.86, 0.24, 0.49, 0.1, 0.62, 0.97, 0.72, 0.21, 0.03, 0.75, 0.97, 0.61, 0.73, 0.94, 0.08, 0.18, 0.35, 0.61, 0.82, 0.57, 0.3, 0.19, 0.9, 0.86, 0.35, 0.98, 0.44, 0.67, 0.03, 0.87, 0.84, 0.79, 0.41, 0.37, 0.4, 0.08, 0.27, 0.79, 0.92, 0.2, 0.19, 0.52, 0.84, 0.22, 0.47, 0.29, 0.89, 0.56, 0.89, 0.05, 0.4, 0.28, 0.05, 0.57, 0.83, 0.82, 0.63, 0.3, 0.89, 0.84, 0.14, 0.9, 0.02, 0.84, 0.96, 0.66, 0.49, 0.61, 0.27, 0.16, 0.68, 0.35, 0.33, 0.83, 0.13, 0.74, 0.62, 0.69, 0.8, 0.27, 0.38, 0.83, 0.25, 0.8, 0.45, 0.2, 0.51, 0.47, 0.44, 0.7, 0.33, 0.53, 0.11, 0.53, 0.76, 0.06, 0.05, 0.72, 0.67, 0.77, 0.45, 0.79, 0.95, 0.38, 0.55, 0.45, 0.56, 0.48, 0.04, 0.99, 0.14, 0, 0.16, 0.72, 0.51, 0.88, 0.09, 0.55, 0.68, 0.51, 0.68, 0.08, 0.75, 0.65, 0.43, 0.06, 0.82, 0.18, 0.55, 0.24, 0.56, 0.96, 0.77, 0.64, 0.16, 0.2, 0.09, 0.7, 0.74, 0.05, 0.85, 0.34, 0, 0.26, 0.41, 0.64, 0.11, 0.67, 0.19, 0.68, 0.91, 0.51, 0.33, 0.85, 0.05, 0.02, 0.7, 0.63, 0.43, 0.12, 0.26, 0.5, 0.21, 0.68, 0.61, 0.13, 0.07, 0.7, 0.38, 0.22, 0.72, 0.16, 0.91, 0.16, 0.25, 0.44, 0.91, 0.18, 0.04, 0.14, 0.86, 0.16, 0.94, 0.35, 0.39, 0.43, 0.82, 0.09, 0.84, 0.02, 0.24, 0.29, 0.88, 0.94, 0.2, 0.77, 0.67, 0.62, 0.21, 0.07, 0.54, 0, 0.19, 0.22, 0.11, 0.98, 0.37, 0.37, 0.22, 0.22, 0.05, 0.68, 0.44, 0.34, 0.56, 0.47, 0.73, 0.77, 0.68, 0.61, 0.59, 0.51, 0.32, 0.37, 0.92, 0.27, 0.06, 0.2, 0.29, 0.83, 0.05, 0.51, 0.3, 0.7, 0.93, 0.12, 0.55, 0.26, 0.62, 0.07, 0.56, 0.06, 0.79, 0.82, 0.41, 0.41, 0.3, 0.78, 0.75, 0.5, 0.3, 0.97, 0.13, 0.08, 0.94, 0.55, 0.23, 0.76, 0.91, 0.16, 0.16, 0.18, 0.05, 0.09, 0.66, 0.7, 0.22, 0.75, 0.86, 0.11, 0.54, 0.77, 0.56, 0.85, 0.11, 0.42, 0.77, 0.09, 0.45, 0.16, 0.65, 0.89, 0.35, 0.87, 0.96, 0.03, 0.22, 0.12, 0.84, 0.92, 0.75, 0.77, 0.06, 0.31, 0.5, 0.38, 0.91, 0.88, 0.75, 0.43, 0.92, 0.11, 0.97, 0.56, 0.96, 0.3, 0.76, 0.86, 0.09, 0.51, 0.86, 0.55, 0.84, 0.3, 0.14, 0.59, 0.37, 0.34, 0.13, 0.14, 0.98, 0.71, 0.79, 0.98, 0.58, 0.86, 0.46, 0.43, 0.38, 0.2, 0.61, 0.78, 0.72, 0.85, 0.37, 0.08, 0.39, 0.38, 0.06, 0.46, 0.48, 0.89, 0.03, 0.95, 0.63, 0.94, 0.83, 0.11, 0.3, 0.77, 0.29, 0.85, 0.89, 0.88, 0.01, 0.65, 0.01, 0.98, 0.13, 0.49, 0.67, 0.37, 0.99, 0.76, 0.3, 0.12, 0.26, 0.7, 0.55, 0.39, 0.56, 0.44, 0.26, 0.91, 0.09, 0.39, 0.55, 0.46, 0.04, 0.4, 0.83, 0.48, 0.27, 0.64, 0.05, 0.97, 0.66, 0.11, 0.16, 0.97, 0.01, 0.25, 0.45, 0.67, 0.71, 0.24, 0.6, 0.04, 0.72, 0.91, 0.7, 0.48, 0.55, 0.91, 0.49, 0.5, 0.72, 0.28, 0.41, 0.98, 0.84, 0.94, 0.41, 0.27, 0.53, 0.89, 0.7, 0.92, 0.43, 0.17, 0.2, 0.08, 0.94, 0.11, 0.24, 0.93, 0.86, 0.96, 0.63, 0.63, 0.48, 0.26, 0.59, 0.81, 0.5, 0.41, 0.9, 0.79, 0.51, 0.89, 0.89, 0.59, 0.19, 0.11, 0.06, 0.23, 0.68, 0.78, 0.23, 0.09, 0.58, 0.36, 0.12, 0.91, 0.72, 0.32, 0.33, 0.22, 0.23, 0.22, 0.65, 0.83, 0.83, 0.03, 1, 0.43, 0.66, 0.54, 0.21, 0.45, 0.75, 0.12, 0.17, 0.86, 0.84, 0.12, 0.28, 0.92, 0.33, 0.62, 0.56, 0.66, 0.1, 0.42, 0.34, 0.13, 0.04, 0.56, 0.23, 0.08, 0.59, 0.8, 0.05, 0.76, 0.31, 0.27, 0.38, 0.01, 0.92, 0.42, 0.86, 0.75, 0.18, 0.45, 0.75, 0.43, 0.4, 0.13, 0.72, 0.43, 0.05, 0.77, 0.66, 0.78, 0.58, 0.49, 0.98, 0.88, 0.42, 0.66, 0.17, 0.17, 0.79, 0.09, 0.82, 0.73, 0.82, 0.96, 0.27, 0.57, 0.29, 0.8, 0.82, 0.78, 0.01, 0.63, 0.89, 0.04, 0.8, 0.23, 0.43, 0.94, 0.25, 0.97, 0.98, 0.32, 0.33, 0.78, 0.91, 0.02, 0.75, 0.14, 0.12, 0.23, 0.02, 0.85, 0.56, 0.72, 0.99, 0.12, 0.32, 0.84, 0.28, 0.25, 0.69, 0.16, 0.6, 0.53, 0.23, 0.82, 0.99, 0.69, 0.55, 0.52, 0.52, 0.41, 0.14, 0.27, 0.05, 0.28, 0.03, 0.9, 0.89, 0.72, 0.63, 0.44, 0.76, 0.65, 0.57, 0.47, 0.43, 0.23, 0.1, 0.36, 0.4, 0.32, 0.83, 0.28, 0.33, 0.04, 0.02, 0.06, 0.95, 0.27, 0.82, 0.59, 0.91, 0.85, 0.55, 0.69, 0.44, 0.59, 0.02, 0.64, 0.22, 0.37, 0.4, 0.85, 0.75, 0.73, 0.08, 0.91, 0.27, 0.49, 0.88, 0.26, 0.31, 0.99, 0.23, 0.96, 0.65, 0.25, 0.79, 0.85, 0.75, 0.68, 0.53, 0.84, 0.97, 0.77, 0.01, 0.06, 0.56, 0.41, 0, 0.12, 0.14, 0.39, 0.79, 0.89, 0.38, 0.99, 0.69, 0.86, 0.19, 0.88, 0.88, 0.3, 0.03, 0.33, 0.05, 0.02, 0.3, 0.59, 0.82, 0.73, 0.05, 0.83, 0.66, 0.39, 0.91, 0.38, 0.77, 0.54, 0.79, 0.75, 0.52, 0.29, 0.9, 0.18, 0.29, 0.8, 0.87, 0.84, 0.14, 0.23, 0.54, 0.35, 0.98, 0.69, 0.03, 0.84, 0.34, 0.31, 0.87, 0.51, 0.14, 0.82, 0.82, 0.31, 0.98, 0.57, 0.54, 0.04, 0.46, 0.76, 0.04, 0.89, 0.78, 0.31, 0.69, 0.75, 0.27, 0.93, 0.93, 0.71, 0.23, 0.49, 0.9, 0.02, 0.14, 0.49, 0.06, 0.93, 0.46, 0.87, 0.79, 0.97, 0.12, 0.49, 0.25, 0.21, 0.52, 0.65, 0.7, 0.99, 0.29, 0.99, 0.97, 0.85, 0.58, 0.23, 0.43, 0.47, 0.1, 0.49, 0.77, 0.56, 0.7, 0.25, 0.64, 0.28, 0.99, 0.26, 0.43, 0.43, 0.23, 0.16, 0.24, 0.42, 0.29, 0.92, 0.04, 0.19, 0.52, 0.92, 0.7, 0.3, 0.66, 0.73, 0.4, 0.34, 0.18, 0.18, 0.43, 0.51, 0.95, 0.92, 0.36, 0.13, 0.91, 0.25, 0.56, 0.54, 0.94, 0.79, 0.15, 0.17, 0.78, 0.72, 0.48, 0.24, 0.95, 0.07, 0.91, 0.46, 0.26, 0.87, 0.99, 0.23, 0.03, 0.27, 0.47, 0.26, 0.4, 0.91, 0.31, 0.72, 0.42, 0.38, 0.52, 0.17, 0.21, 0.24, 0.79, 0.26, 0.57, 0.86, 0.9, 0.46, 0.67, 0.61, 0.39, 0.76, 0.86, 0.15, 0.45, 0.55, 0.52, 0.72, 0.99, 0.6, 0.81, 0.95, 0.94, 0.51, 0.9, 0.76, 0.49, 0.62, 0.37, 0.21, 0.14, 0.9, 0.78, 0.27, 0.9, 0.57, 0.59, 0.3, 0.76, 0.24, 0.26, 0.27, 0.51, 0.25, 0.01, 0.92, 0.25, 0.2, 0.86, 0.92, 0.4, 0.14, 0.66, 0.69, 0.72, 0.81, 0.02, 0.94, 0.23, 0, 0.74, 0.59, 0.22, 0.81, 0.39, 0.08, 0.09, 0.14, 0.22, 0.37, 0.74, 0.55, 0.05, 0.09, 0.27, 0.43, 0.69, 0.55, 0.3, 0.53, 0.31, 0.33, 0.97, 0.77, 0.22, 0.51, 0.51, 0.25, 0.09, 0.62, 0.74, 0.77, 0.13, 0.76, 0.3, 0.4, 0.06, 0.2, 0.44, 0.94, 0.74, 0.61, 0.2, 0.76, 1, 0.24, 0.12, 0.55, 0.11, 0.04, 0.35, 0.69, 0.88, 0.43, 0.72, 0.17, 0.7, 0.86, 0.94, 0.94, 0.84, 0.01, 0.73, 0.67, 0.56, 0.03, 0.55, 0.27, 0.97, 0.7, 0.12, 0.78, 0.29, 0.43, 0.27, 0.76, 0.36, 0.13, 0.25, 0.68, 0.25, 0.35, 0.89, 0.77, 0.64, 0.84, 0.34, 0.57, 0.54, 0.41, 0.78, 0.75, 0.38, 0.48, 0.33, 0.43, 0.14, 0.86, 0.72, 0.24, 0.74, 0.6, 0.88, 0.84, 0.31, 0.51, 0.7, 0.66, 0.79, 0.15, 0.46, 0.33, 0.99, 0.03, 0.98, 0.66, 0.73, 0.38, 0.21, 0.51, 0.1, 0.11, 0.38, 0.73, 0.45, 0.97, 0.58, 0.97, 0.72, 0.83, 0.91, 0.8, 0.86, 0.05, 0.25, 0.47, 0.25, 0.97, 0.71, 0.32, 0.53, 1, 0.81, 0.26, 0.5, 0.65, 0.57, 0.1, 0.39, 0.4, 0.48, 0.51, 0.28, 0.79, 0.81, 0.03, 0, 0.01, 0.45, 0.54, 0.35, 0.07, 0.57, 0.95, 0.62, 0.2, 0.55, 0.9, 0.1, 0.04, 0.37, 0.28, 0.22, 0.25, 0.99, 0.09, 0.37, 0.62, 0.14, 0.05, 0.82, 0.82, 0.39, 0.59, 0.6, 0.22, 0.48, 0.57, 0.63, 0.18, 0.33, 0.14, 0.06, 0.78, 0.81, 0.34, 0.91, 0.92, 0.32, 0.1, 0.54, 0.56, 0.5, 0.87, 0.47, 0.91, 0.75, 0.04, 0.07, 0.79, 0.27, 0.39, 0.04, 0.08, 0.26, 0.97, 0.68, 0.49, 0.91, 0.54, 0.42, 0.33, 0.84, 0.55, 0.3, 0.61, 0.96, 0.34, 0.22, 0.55, 0.52, 0.15, 0.86, 0.31, 0.15, 0.63, 0.38, 0.26, 0.53, 0.83, 0.26, 0.13, 0.97, 0.63, 0.51, 0.83, 0.72, 0.09, 0.38, 0.84, 0.79, 0.77, 0.2, 0.66, 0.1, 0.05, 0.44, 0.14, 0.36, 0.16, 0.89, 0.74, 0.09, 0.02, 0.05, 0.48, 0.57, 0.89, 0.07, 0.67, 0.89, 0.58, 0.25, 0.98, 0.31, 0.6, 0.01, 0.27, 0.19, 0.81, 0.19, 0.49, 0.89, 0.2, 0.69, 0.49, 0.27, 0.14, 0.26, 0.06],
      metadata={"metadata_field": "metadata_value"},
    )
  ]
)

index.query(
  vector=[0.76, 0.67, 0.87, 0.11, 0.68, 0.32, 0.47, 0.77, 0.43, 0.33, 0.29, 0.55, 0.54, 0.04, 0.05, 0.94, 0.97, 0.35, 0.02, 0.63, 0.63, 0.92, 0.47, 0.51, 0.37, 0.69, 0.34, 0.32, 0.57, 0.42, 0.84, 0.15, 0.25, 0.5, 0.62, 0.35, 0.97, 0.52, 0.82, 0.51, 0.01, 0.43, 0.67, 0.73, 0.49, 0.73, 0.69, 0.96, 0.66, 0.69, 0.46, 0.05, 0.01, 0.17, 0.35, 0.58, 0.58, 0.81, 0.22, 0.33, 0.56, 0.22, 0.67, 0.87, 0.64, 0.36, 0.1, 0.73, 0.2, 0.44, 0.6, 0.5, 0.72, 0.58, 0.02, 0.18, 0.3, 0.56, 0.05, 0.38, 0.43, 0.74, 0.92, 0.96, 0.02, 0.97, 0.94, 0.79, 0.38, 0.24, 0.95, 0.77, 0.14, 0.93, 0.64, 0.53, 0.2, 0.9, 0.93, 0.54, 0.89, 0.33, 0.14, 0.28, 0.76, 0.68, 0.49, 0.71, 0.37, 0.59, 0.21, 0.29, 0.15, 0.65, 0.02, 0.47, 0.2, 0.32, 0.01, 0.06, 0.02, 0.09, 0.1, 0.81, 0.06, 0.12, 0.69, 0.85, 0.83, 0.3, 0.71, 0.97, 0.47, 0.52, 0.03, 0.06, 0.85, 0.41, 0.39, 0.78, 0.59, 0.25, 0.66, 0.83, 0.01, 0.72, 0.64, 0.41, 0.02, 0.58, 0.02, 0.59, 0.18, 0.72, 0.03, 0.41, 1, 0.81, 0.99, 0.29, 0.47, 0.84, 0.74, 0.48, 0.19, 0.49, 0.26, 0.97, 0.79, 0.49, 0.34, 0.24, 1, 0.25, 0.92, 0.6, 0.82, 0.5, 0.16, 0.98, 0.25, 0.3, 0.31, 0.83, 0.5, 0.8, 0.25, 0.47, 0.27, 0.74, 0.54, 0.38, 0.18, 0.94, 1, 0.47, 0.65, 0.27, 0.39, 0.67, 0.14, 0.29, 0.54, 0.93, 0.6, 0.3, 0.94, 0.87, 0.77, 0.03, 0.94, 0.42, 0.65, 0.18, 0.73, 0.37, 0.1, 1, 0.12, 0.35, 0.51, 0.07, 0.71, 0.75, 0.61, 0.18, 0.16, 0.51, 0.98, 0.86, 0.29, 0.36, 0.19, 0.39, 0.92, 0.94, 0.41, 0.1, 0.34, 0.77, 1, 0.08, 0.53, 0.65, 0.83, 0.25, 0.47, 0.85, 0.63, 0.63, 0.77, 0.99, 0.31, 0.01, 0.49, 0.58, 0.53, 0.07, 0.62, 0.72, 0.59, 0.96, 0.1, 0.84, 0.72, 0.89, 0.05, 0.13, 0.44, 0.86, 0.14, 0.45, 0.19, 0.09, 0.56, 0.12, 0.44, 0.58, 0.1, 0.6, 0.06, 0.72, 0.8, 0.24, 0.35, 0.07, 0.36, 0.21, 0.87, 0.84, 0.74, 0.5, 0.86, 0.9, 0.02, 0.7, 0.36, 0.5, 0.78, 0.34, 0.12, 0.57, 0.36, 0.41, 0.67, 0.24, 0.85, 0.81, 0.55, 0.28, 0.13, 0.41, 0.18, 0.91, 0.71, 0.58, 0.74, 0.02, 0.09, 0.81, 0.22, 0.96, 0.05, 0.83, 0.75, 0.97, 0.01, 0.63, 0.35, 0.13, 0.77, 0.76, 0.72, 0.82, 0.94, 0.35, 0.51, 0.83, 0.96, 0.59, 0.43, 0.06, 0.31, 0.64, 0.85, 0.62, 0.45, 0.48, 0.95, 0.17, 0.93, 0.06, 0.29, 0.03, 0.63, 0.18, 0.37, 0.99, 0.41, 0.47, 0, 0.98, 0.11, 0.5, 0.04, 0.69, 0.6, 0.51, 0.18, 0.77, 0.47, 0.76, 0.34, 0.45, 0.86, 0.24, 0.49, 0.1, 0.62, 0.97, 0.72, 0.21, 0.03, 0.75, 0.97, 0.61, 0.73, 0.94, 0.08, 0.18, 0.35, 0.61, 0.82, 0.57, 0.3, 0.19, 0.9, 0.86, 0.35, 0.98, 0.44, 0.67, 0.03, 0.87, 0.84, 0.79, 0.41, 0.37, 0.4, 0.08, 0.27, 0.79, 0.92, 0.2, 0.19, 0.52, 0.84, 0.22, 0.47, 0.29, 0.89, 0.56, 0.89, 0.05, 0.4, 0.28, 0.05, 0.57, 0.83, 0.82, 0.63, 0.3, 0.89, 0.84, 0.14, 0.9, 0.02, 0.84, 0.96, 0.66, 0.49, 0.61, 0.27, 0.16, 0.68, 0.35, 0.33, 0.83, 0.13, 0.74, 0.62, 0.69, 0.8, 0.27, 0.38, 0.83, 0.25, 0.8, 0.45, 0.2, 0.51, 0.47, 0.44, 0.7, 0.33, 0.53, 0.11, 0.53, 0.76, 0.06, 0.05, 0.72, 0.67, 0.77, 0.45, 0.79, 0.95, 0.38, 0.55, 0.45, 0.56, 0.48, 0.04, 0.99, 0.14, 0, 0.16, 0.72, 0.51, 0.88, 0.09, 0.55, 0.68, 0.51, 0.68, 0.08, 0.75, 0.65, 0.43, 0.06, 0.82, 0.18, 0.55, 0.24, 0.56, 0.96, 0.77, 0.64, 0.16, 0.2, 0.09, 0.7, 0.74, 0.05, 0.85, 0.34, 0, 0.26, 0.41, 0.64, 0.11, 0.67, 0.19, 0.68, 0.91, 0.51, 0.33, 0.85, 0.05, 0.02, 0.7, 0.63, 0.43, 0.12, 0.26, 0.5, 0.21, 0.68, 0.61, 0.13, 0.07, 0.7, 0.38, 0.22, 0.72, 0.16, 0.91, 0.16, 0.25, 0.44, 0.91, 0.18, 0.04, 0.14, 0.86, 0.16, 0.94, 0.35, 0.39, 0.43, 0.82, 0.09, 0.84, 0.02, 0.24, 0.29, 0.88, 0.94, 0.2, 0.77, 0.67, 0.62, 0.21, 0.07, 0.54, 0, 0.19, 0.22, 0.11, 0.98, 0.37, 0.37, 0.22, 0.22, 0.05, 0.68, 0.44, 0.34, 0.56, 0.47, 0.73, 0.77, 0.68, 0.61, 0.59, 0.51, 0.32, 0.37, 0.92, 0.27, 0.06, 0.2, 0.29, 0.83, 0.05, 0.51, 0.3, 0.7, 0.93, 0.12, 0.55, 0.26, 0.62, 0.07, 0.56, 0.06, 0.79, 0.82, 0.41, 0.41, 0.3, 0.78, 0.75, 0.5, 0.3, 0.97, 0.13, 0.08, 0.94, 0.55, 0.23, 0.76, 0.91, 0.16, 0.16, 0.18, 0.05, 0.09, 0.66, 0.7, 0.22, 0.75, 0.86, 0.11, 0.54, 0.77, 0.56, 0.85, 0.11, 0.42, 0.77, 0.09, 0.45, 0.16, 0.65, 0.89, 0.35, 0.87, 0.96, 0.03, 0.22, 0.12, 0.84, 0.92, 0.75, 0.77, 0.06, 0.31, 0.5, 0.38, 0.91, 0.88, 0.75, 0.43, 0.92, 0.11, 0.97, 0.56, 0.96, 0.3, 0.76, 0.86, 0.09, 0.51, 0.86, 0.55, 0.84, 0.3, 0.14, 0.59, 0.37, 0.34, 0.13, 0.14, 0.98, 0.71, 0.79, 0.98, 0.58, 0.86, 0.46, 0.43, 0.38, 0.2, 0.61, 0.78, 0.72, 0.85, 0.37, 0.08, 0.39, 0.38, 0.06, 0.46, 0.48, 0.89, 0.03, 0.95, 0.63, 0.94, 0.83, 0.11, 0.3, 0.77, 0.29, 0.85, 0.89, 0.88, 0.01, 0.65, 0.01, 0.98, 0.13, 0.49, 0.67, 0.37, 0.99, 0.76, 0.3, 0.12, 0.26, 0.7, 0.55, 0.39, 0.56, 0.44, 0.26, 0.91, 0.09, 0.39, 0.55, 0.46, 0.04, 0.4, 0.83, 0.48, 0.27, 0.64, 0.05, 0.97, 0.66, 0.11, 0.16, 0.97, 0.01, 0.25, 0.45, 0.67, 0.71, 0.24, 0.6, 0.04, 0.72, 0.91, 0.7, 0.48, 0.55, 0.91, 0.49, 0.5, 0.72, 0.28, 0.41, 0.98, 0.84, 0.94, 0.41, 0.27, 0.53, 0.89, 0.7, 0.92, 0.43, 0.17, 0.2, 0.08, 0.94, 0.11, 0.24, 0.93, 0.86, 0.96, 0.63, 0.63, 0.48, 0.26, 0.59, 0.81, 0.5, 0.41, 0.9, 0.79, 0.51, 0.89, 0.89, 0.59, 0.19, 0.11, 0.06, 0.23, 0.68, 0.78, 0.23, 0.09, 0.58, 0.36, 0.12, 0.91, 0.72, 0.32, 0.33, 0.22, 0.23, 0.22, 0.65, 0.83, 0.83, 0.03, 1, 0.43, 0.66, 0.54, 0.21, 0.45, 0.75, 0.12, 0.17, 0.86, 0.84, 0.12, 0.28, 0.92, 0.33, 0.62, 0.56, 0.66, 0.1, 0.42, 0.34, 0.13, 0.04, 0.56, 0.23, 0.08, 0.59, 0.8, 0.05, 0.76, 0.31, 0.27, 0.38, 0.01, 0.92, 0.42, 0.86, 0.75, 0.18, 0.45, 0.75, 0.43, 0.4, 0.13, 0.72, 0.43, 0.05, 0.77, 0.66, 0.78, 0.58, 0.49, 0.98, 0.88, 0.42, 0.66, 0.17, 0.17, 0.79, 0.09, 0.82, 0.73, 0.82, 0.96, 0.27, 0.57, 0.29, 0.8, 0.82, 0.78, 0.01, 0.63, 0.89, 0.04, 0.8, 0.23, 0.43, 0.94, 0.25, 0.97, 0.98, 0.32, 0.33, 0.78, 0.91, 0.02, 0.75, 0.14, 0.12, 0.23, 0.02, 0.85, 0.56, 0.72, 0.99, 0.12, 0.32, 0.84, 0.28, 0.25, 0.69, 0.16, 0.6, 0.53, 0.23, 0.82, 0.99, 0.69, 0.55, 0.52, 0.52, 0.41, 0.14, 0.27, 0.05, 0.28, 0.03, 0.9, 0.89, 0.72, 0.63, 0.44, 0.76, 0.65, 0.57, 0.47, 0.43, 0.23, 0.1, 0.36, 0.4, 0.32, 0.83, 0.28, 0.33, 0.04, 0.02, 0.06, 0.95, 0.27, 0.82, 0.59, 0.91, 0.85, 0.55, 0.69, 0.44, 0.59, 0.02, 0.64, 0.22, 0.37, 0.4, 0.85, 0.75, 0.73, 0.08, 0.91, 0.27, 0.49, 0.88, 0.26, 0.31, 0.99, 0.23, 0.96, 0.65, 0.25, 0.79, 0.85, 0.75, 0.68, 0.53, 0.84, 0.97, 0.77, 0.01, 0.06, 0.56, 0.41, 0, 0.12, 0.14, 0.39, 0.79, 0.89, 0.38, 0.99, 0.69, 0.86, 0.19, 0.88, 0.88, 0.3, 0.03, 0.33, 0.05, 0.02, 0.3, 0.59, 0.82, 0.73, 0.05, 0.83, 0.66, 0.39, 0.91, 0.38, 0.77, 0.54, 0.79, 0.75, 0.52, 0.29, 0.9, 0.18, 0.29, 0.8, 0.87, 0.84, 0.14, 0.23, 0.54, 0.35, 0.98, 0.69, 0.03, 0.84, 0.34, 0.31, 0.87, 0.51, 0.14, 0.82, 0.82, 0.31, 0.98, 0.57, 0.54, 0.04, 0.46, 0.76, 0.04, 0.89, 0.78, 0.31, 0.69, 0.75, 0.27, 0.93, 0.93, 0.71, 0.23, 0.49, 0.9, 0.02, 0.14, 0.49, 0.06, 0.93, 0.46, 0.87, 0.79, 0.97, 0.12, 0.49, 0.25, 0.21, 0.52, 0.65, 0.7, 0.99, 0.29, 0.99, 0.97, 0.85, 0.58, 0.23, 0.43, 0.47, 0.1, 0.49, 0.77, 0.56, 0.7, 0.25, 0.64, 0.28, 0.99, 0.26, 0.43, 0.43, 0.23, 0.16, 0.24, 0.42, 0.29, 0.92, 0.04, 0.19, 0.52, 0.92, 0.7, 0.3, 0.66, 0.73, 0.4, 0.34, 0.18, 0.18, 0.43, 0.51, 0.95, 0.92, 0.36, 0.13, 0.91, 0.25, 0.56, 0.54, 0.94, 0.79, 0.15, 0.17, 0.78, 0.72, 0.48, 0.24, 0.95, 0.07, 0.91, 0.46, 0.26, 0.87, 0.99, 0.23, 0.03, 0.27, 0.47, 0.26, 0.4, 0.91, 0.31, 0.72, 0.42, 0.38, 0.52, 0.17, 0.21, 0.24, 0.79, 0.26, 0.57, 0.86, 0.9, 0.46, 0.67, 0.61, 0.39, 0.76, 0.86, 0.15, 0.45, 0.55, 0.52, 0.72, 0.99, 0.6, 0.81, 0.95, 0.94, 0.51, 0.9, 0.76, 0.49, 0.62, 0.37, 0.21, 0.14, 0.9, 0.78, 0.27, 0.9, 0.57, 0.59, 0.3, 0.76, 0.24, 0.26, 0.27, 0.51, 0.25, 0.01, 0.92, 0.25, 0.2, 0.86, 0.92, 0.4, 0.14, 0.66, 0.69, 0.72, 0.81, 0.02, 0.94, 0.23, 0, 0.74, 0.59, 0.22, 0.81, 0.39, 0.08, 0.09, 0.14, 0.22, 0.37, 0.74, 0.55, 0.05, 0.09, 0.27, 0.43, 0.69, 0.55, 0.3, 0.53, 0.31, 0.33, 0.97, 0.77, 0.22, 0.51, 0.51, 0.25, 0.09, 0.62, 0.74, 0.77, 0.13, 0.76, 0.3, 0.4, 0.06, 0.2, 0.44, 0.94, 0.74, 0.61, 0.2, 0.76, 1, 0.24, 0.12, 0.55, 0.11, 0.04, 0.35, 0.69, 0.88, 0.43, 0.72, 0.17, 0.7, 0.86, 0.94, 0.94, 0.84, 0.01, 0.73, 0.67, 0.56, 0.03, 0.55, 0.27, 0.97, 0.7, 0.12, 0.78, 0.29, 0.43, 0.27, 0.76, 0.36, 0.13, 0.25, 0.68, 0.25, 0.35, 0.89, 0.77, 0.64, 0.84, 0.34, 0.57, 0.54, 0.41, 0.78, 0.75, 0.38, 0.48, 0.33, 0.43, 0.14, 0.86, 0.72, 0.24, 0.74, 0.6, 0.88, 0.84, 0.31, 0.51, 0.7, 0.66, 0.79, 0.15, 0.46, 0.33, 0.99, 0.03, 0.98, 0.66, 0.73, 0.38, 0.21, 0.51, 0.1, 0.11, 0.38, 0.73, 0.45, 0.97, 0.58, 0.97, 0.72, 0.83, 0.91, 0.8, 0.86, 0.05, 0.25, 0.47, 0.25, 0.97, 0.71, 0.32, 0.53, 1, 0.81, 0.26, 0.5, 0.65, 0.57, 0.1, 0.39, 0.4, 0.48, 0.51, 0.28, 0.79, 0.81, 0.03, 0, 0.01, 0.45, 0.54, 0.35, 0.07, 0.57, 0.95, 0.62, 0.2, 0.55, 0.9, 0.1, 0.04, 0.37, 0.28, 0.22, 0.25, 0.99, 0.09, 0.37, 0.62, 0.14, 0.05, 0.82, 0.82, 0.39, 0.59, 0.6, 0.22, 0.48, 0.57, 0.63, 0.18, 0.33, 0.14, 0.06, 0.78, 0.81, 0.34, 0.91, 0.92, 0.32, 0.1, 0.54, 0.56, 0.5, 0.87, 0.47, 0.91, 0.75, 0.04, 0.07, 0.79, 0.27, 0.39, 0.04, 0.08, 0.26, 0.97, 0.68, 0.49, 0.91, 0.54, 0.42, 0.33, 0.84, 0.55, 0.3, 0.61, 0.96, 0.34, 0.22, 0.55, 0.52, 0.15, 0.86, 0.31, 0.15, 0.63, 0.38, 0.26, 0.53, 0.83, 0.26, 0.13, 0.97, 0.63, 0.51, 0.83, 0.72, 0.09, 0.38, 0.84, 0.79, 0.77, 0.2, 0.66, 0.1, 0.05, 0.44, 0.14, 0.36, 0.16, 0.89, 0.74, 0.09, 0.02, 0.05, 0.48, 0.57, 0.89, 0.07, 0.67, 0.89, 0.58, 0.25, 0.98, 0.31, 0.6, 0.01, 0.27, 0.19, 0.81, 0.19, 0.49, 0.89, 0.2, 0.69, 0.49, 0.27, 0.14, 0.26, 0.06],
  top_k=1,
  include_vectors=True,
  include_metadata=True,
)
