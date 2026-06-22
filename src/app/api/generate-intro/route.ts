export async function POST(request: Request) {
  try {
    const {
      customerName,
      customerDesignation,
      customerCompany,
      customerCity,
      matchName,
      matchDesignation,
      matchCompany,
      matchCity,
      customerReligion,
      matchReligion,
      customerFamilyType,
      matchFamilyType,
      matchOpenToRelocate,
      matchWantKids,
    } = await request.json();

    // Build a friendly, deterministic introduction without calling external APIs
    const parts: string[] = [];

    const matchRole = matchDesignation || matchCompany || 'professional';
    parts.push(`We'd like to introduce you to ${matchName}, a ${matchRole} based in ${matchCity || 'their city'}.`);

    const sharedValues = customerReligion || matchReligion || customerFamilyType || matchFamilyType;
    if (sharedValues) {
      parts.push(`With shared values around ${sharedValues}, and complementary career backgrounds, we believe this could be a meaningful connection.`);
    } else {
      parts.push('They have complementary backgrounds and values that suggest a meaningful connection.');
    }

    const relocation = matchOpenToRelocate ? 'open to relocation' : 'not open to relocation';
    const kids = typeof matchWantKids === 'boolean' ? (matchWantKids ? 'wants kids' : "doesn't want kids") : 'has unspecified preferences on kids';
    parts.push(`${matchName} is ${relocation} and ${kids} — aligning with your preferences.`);

    const intro = parts.join(' ');

    return Response.json({ intro });
  } catch (error) {
    console.error('Error in generate-intro fallback:', error);
    return Response.json({ intro: '' });
  }
}
