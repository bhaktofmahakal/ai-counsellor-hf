interface HipolabsUniversity {
    name: string;
    country: string;
    domains: string[];
    web_pages: string[];
    'state-province': string | null;
}

export async function fetchExternalUniversities(query?: string, country?: string) {
    try {
        const params = new URLSearchParams();
        if (query) params.append('name', query);
        if (country) params.append('country', country);

        const response = await fetch(`http://universities.hipolabs.com/search?${params.toString()}`);
        if (!response.ok) throw new Error('Hipolabs API failed');

        const data: HipolabsUniversity[] = await response.json();

        // Map to our internal University format
        return data.map((uni, index: number) => {
            const domain = uni.domains?.[0] || '';
            // Create a deterministic seed from the name
            const seed = uni.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // Production Logic: Country-specific tuition and cost of living
            const country = uni.country.toLowerCase();
            let baseTuition = 15000;
            let baseLiving = 1200;
            let currency = 'USD';

            if (country.includes('united kingdom') || country === 'uk') {
                baseTuition = 20000;
                baseLiving = 1500;
                currency = 'GBP';
            } else if (country.includes('germany')) {
                baseTuition = 500; // Public universities are low cost
                baseLiving = 1000;
            } else if (country.includes('canada')) {
                baseTuition = 25000;
                baseLiving = 1300;
            } else if (country.includes('australia')) {
                baseTuition = 30000;
                baseLiving = 1800;
            }

            return {
                id: `ext-${index}-${domain.replace(/\./g, '-')}`,
                name: uni.name,
                location: uni['state-province'] || 'Main Campus',
                country: uni.country,
                rank: (seed % 900) + 100, // Deterministic rank 100-1000
                tuition: baseTuition + ((seed % 20) * 1000), 
                acceptanceRate: `${15 + (seed % 70)}%`, 
                matchScore: 0,
                tags: ["Global", currency],
                programs: ["Computer Science", "Engineering", "Business Administration", "Data Science", "Psychology"],
                description: `${uni.name} is a leading academic institution in ${uni.country} known for its research excellence and global community.`,
                strengths: ["Global Recognition", "Strong Research Focus"],
                risks: ["Competitive Entry"],
                website: uni.web_pages?.[0] || '',
                domain: domain,
                costOfLiving: baseLiving + ((seed % 10) * 100), 
                avgSalary: 50000 + ((seed % 60) * 1000), 
                deadlines: new Date(2026, 0, 15), // Unified fallback for demo
            };
        }).slice(0, 50);
    } catch (error) {
        console.error('❌ [ExternalAPI] Error:', error);
        return [];
    }
}
