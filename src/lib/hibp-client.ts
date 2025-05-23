// lib/hibp-client.ts
export class HIBPClient {
  private apiKey: string;
  private baseUrl = 'https://haveibeenpwned.com/api/v3';
  private userAgent: string;

  constructor(apiKey: string, userAgent: string = 'Supabase-HIBP-Integration') {
    this.apiKey = apiKey;
    this.userAgent = userAgent;
  }

  private async makeRequest(endpoint: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'hibp-api-key': this.apiKey,
        'user-agent': this.userAgent,
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
    }

    return response;
  }

  async checkBreaches(email: string, truncateResponse = true): Promise<BreachData[]> {
    try {
      const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
      const response = await this.makeRequest(
        `/breachedaccount/${encodedEmail}?truncateResponse=${truncateResponse}`
      );

      if (response.status === 404) {
        return []; // No breaches found
      }

      if (!response.ok) {
        throw new Error(`HIBP API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking breaches:', error);
      throw error;
    }
  }

  async checkPastes(email: string): Promise<PasteData[]> {
    try {
      const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
      const response = await this.makeRequest(`/pasteaccount/${encodedEmail}`);

      if (response.status === 404) {
        return []; // No pastes found
      }

      if (!response.ok) {
        throw new Error(`HIBP API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking pastes:', error);
      throw error;
    }
  }

  async checkPassword(password: string): Promise<{ isCompromised: boolean; count: number }> {
    try {
      // Create SHA-1 hash of password
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // Use k-anonymity model - send only first 5 characters
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {
          'Add-Padding': 'true', // Enable padding for privacy
        },
      });

      if (!response.ok) {
        throw new Error(`Pwned Passwords API error: ${response.status}`);
      }

      const results = await response.text();
      const lines = results.split('\n');

      for (const line of lines) {
        const [hashSuffix, countStr] = line.split(':');
        if (hashSuffix === suffix) {
          return {
            isCompromised: true,
            count: parseInt(countStr, 10),
          };
        }
      }

      return { isCompromised: false, count: 0 };
    } catch (error) {
      console.error('Error checking password:', error);
      throw error;
    }
  }

  async performFullCheck(email: string): Promise<HIBPCheckResult> {
    const [breaches, pastes] = await Promise.all([
      this.checkBreaches(email, false), // Get full breach data
      this.checkPastes(email),
    ]);

    return {
      email,
      isCompromised: breaches.length > 0 || pastes.length > 0,
      breaches,
      pastes,
      checkedAt: new Date().toISOString(),
    };
  }
}
