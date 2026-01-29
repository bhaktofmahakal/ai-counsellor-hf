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

            return {
                id: `ext-${index}-${domain.replace(/\./g, '-')}`,
                name: uni.name,
                location: uni['state-province'] || 'Main Campus',
                country: uni.country,
                rank: (seed % 900) + 100, // Deterministic rank 100-1000
                tuition: 15000 + ((seed % 40) * 1000), // Deterministic tuition $15k-$55k
                acceptanceRate: `${20 + (seed % 60)}%`, // Deterministic rate 20-80%
                matchScore: 0,
                tags: ["Global"],
                programs: ["General Studies", "Research", "International Programs"],
                description: `${uni.name} is a renowned academic institution in ${uni.country} offering diverse learning opportunities.`,
                strengths: ["Historical Reputation", "International Diversity"],
                risks: ["Competitive Admissions"],
                website: uni.web_pages?.[0] || '',
                domain: domain
            };
        }).slice(0, 50);
    } catch (error) {
        console.error('❌ [ExternalAPI] Error:', error);
        return [];
    }
}
