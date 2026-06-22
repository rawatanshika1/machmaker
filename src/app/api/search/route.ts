import { getCustomers } from '@/lib/customers';
import { Customer } from '@/types/customer';

function formatCustomerProfile(customer: Customer): string {
  return `ID: ${customer.id}, Name: ${customer.firstName} ${customer.lastName}, Gender: ${customer.gender}, Age: ${new Date().getFullYear() - new Date(customer.dob).getFullYear()}, City: ${customer.city}, Designation: ${customer.designation}, Company: ${customer.company}, Religion: ${customer.religion}, Caste: ${customer.caste}, Open to Relocate: ${customer.openToRelocate}, Want Kids: ${customer.wantKids}, Income: ₹${customer.income}`;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Local fallback search: keyword-based matching and simple scoring
    const customers = getCustomers();
    const q = String(query || '').toLowerCase();
    const tokens = q.split(/[^a-z0-9]+/i).filter(Boolean);

    function scoreForCustomer(cust: any) {
      let score = 0;
      const matches: string[] = [];

      if (!q) {
        // If no query, give some default score
        score = 10;
        matches.push('Default match');
      }

      if (cust.city && tokens.includes(cust.city.toLowerCase())) {
        score += 40;
        matches.push(`City: ${cust.city}`);
      }

      if (cust.religion && tokens.includes(cust.religion.toLowerCase())) {
        score += 25;
        matches.push(`Religion: ${cust.religion}`);
      }

      if (cust.dietPreference && tokens.includes(cust.dietPreference.toLowerCase())) {
        score += 20;
        matches.push(`Diet: ${cust.dietPreference}`);
      }

      if ((tokens.includes('relocate') || tokens.includes('relocation') || q.includes('open to relocate')) && cust.openToRelocate) {
        score += 20;
        matches.push('Open to relocation');
      }

      if (tokens.includes('kids') && typeof cust.wantKids === 'boolean') {
        if (cust.wantKids) {
          score += 15;
          matches.push('Wants kids');
        } else {
          score += 10;
          matches.push("Doesn't want kids");
        }
      }

      if (cust.designation && tokens.some((t) => cust.designation.toLowerCase().includes(t))) {
        score += 10;
        matches.push(`Role: ${cust.designation}`);
      }
      if (cust.company && tokens.some((t) => cust.company.toLowerCase().includes(t))) {
        score += 8;
        matches.push(`Company: ${cust.company}`);
      }
      if (Array.isArray(cust.habits) && tokens.some((t) => cust.habits.map((h: string) => h.toLowerCase()).includes(t))) {
        score += 6;
        matches.push('Lifestyle match');
      }

      if (cust.city && q.includes(cust.city.toLowerCase())) {
        score += 5;
      }

      return { score: Math.min(100, Math.round(score)), matches };
    }

    const scored = customers.map((c) => {
      const { score, matches } = scoreForCustomer(c);
      return {
        id: String(c.id),
        score,
        reason: matches.length > 0 ? matches.slice(0, 3).map((m) => m.replace(/^City: /, '').replace(/^Religion: /, '').replace(/^Diet: /, '')).join(' and ') : 'Similar background',
      };
    });

    const results = scored
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => ({ id: r.id, reason: r.reason, score: r.score }));

    return Response.json(results);
  } catch (error) {
    console.error('Error in search API fallback:', error);
    return Response.json([]);
  }
}
