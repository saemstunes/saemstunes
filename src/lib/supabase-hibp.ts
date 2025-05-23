// lib/supabase-hibp.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HIBPClient } from './hibp-client';

export class SupabaseHIBPIntegration {
  private supabase: SupabaseClient;
  private hibp: HIBPClient;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    hibpApiKey: string,
    userAgent?: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.hibp = new HIBPClient(hibpApiKey, userAgent);
  }

  // Create table for storing breach check results
  async createHIBPTable() {
    const { error } = await this.supabase.rpc('create_hibp_table');
    if (error) {
      console.error('Error creating HIBP table:', error);
      throw error;
    }
  }

  // Check if email is compromised and store result
  async checkAndStoreEmail(email: string, userId?: string): Promise<HIBPCheckResult> {
    try {
      const result = await this.hibp.performFullCheck(email);

      // Store the result in Supabase
      const { error } = await this.supabase.from('email_breach_checks').upsert({
        email: result.email,
        user_id: userId,
        is_compromised: result.isCompromised,
        breaches: result.breaches,
        pastes: result.pastes,
        checked_at: result.checkedAt,
        breach_count: result.breaches.length,
        paste_count: result.pastes.length,
      });

      if (error) {
        console.error('Error storing HIBP result:', error);
      }

      return result;
    } catch (error) {
      console.error('Error in checkAndStoreEmail:', error);
      throw error;
    }
  }

  // Get stored breach check results
  async getStoredResults(email: string): Promise<HIBPCheckResult | null> {
    const { data, error } = await this.supabase
      .from('email_breach_checks')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('checked_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      email: data.email,
      isCompromised: data.is_compromised,
      breaches: data.breaches || [],
      pastes: data.pastes || [],
      checkedAt: data.checked_at,
    };
  }

  // Check if we should re-check (e.g., if last check was more than 24 hours ago)
  shouldRecheck(lastChecked: string, hoursThreshold = 24): boolean {
    const lastCheckDate = new Date(lastChecked);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff > hoursThreshold;
  }

  // Smart check: use cached data if recent, otherwise check HIBP
  async smartCheck(email: string, userId?: string): Promise<HIBPCheckResult> {
    const stored = await this.getStoredResults(email);

    if (stored && !this.shouldRecheck(stored.checkedAt)) {
      return stored;
    }

    return await this.checkAndStoreEmail(email, userId);
  }

  // Bulk check multiple emails (with rate limiting consideration)
  async bulkCheck(
    emails: string[],
    userId?: string,
    delayMs = 1500 // Delay between requests to respect rate limits
  ): Promise<HIBPCheckResult[]> {
    const results: HIBPCheckResult[] = [];

    for (const email of emails) {
      try {
        const result = await this.smartCheck(email, userId);
        results.push(result);

        // Delay to respect rate limits
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Error checking ${email}:`, error);
        // Continue with other emails even if one fails
      }
    }

    return results;
  }

  // Auth hook integration - check email during signup/signin
  async handleAuthEvent(email: string, userId: string, event: 'signup' | 'signin') {
    try {
      const result = await this.smartCheck(email, userId);

      // You can add custom logic here based on the result
      if (result.isCompromised) {
        console.warn(`Compromised email detected for user ${userId}: ${email}`);
        
        // Optional: Send notification, force password reset, etc.
        await this.handleCompromisedEmail(email, userId, result);
      }

      return result;
    } catch (error) {
      console.error('Error in auth event handler:', error);
      return null;
    }
  }

  // Handle compromised email (customize as needed)
  private async handleCompromisedEmail(
    email: string,
    userId: string,
    result: HIBPCheckResult
  ) {
    // Example actions:
    // 1. Send warning email
    // 2. Force password reset
    // 3. Add security flag to user profile
    // 4. Log security event

    const { error } = await this.supabase.from('security_events').insert({
      user_id: userId,
      event_type: 'compromised_email_detected',
      email,
      breach_count: result.breaches.length,
      paste_count: result.pastes.length,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error logging security event:', error);
    }
  }
}
// Usage example in your application
export async function initializeHIBP() {
  const integration = new SupabaseHIBPIntegration(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for server-side
    process.env.HIBP_API_KEY!,
    'YourApp-HIBP-Integration'
  );

  return integration;
}

// React Hook for client-side usage
import { useState, useEffect } from 'react';

export function useHIBPCheck(email: string) {
  const [result, setResult] = useState<HIBPCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      // Call your API endpoint that uses the HIBP integration
      const response = await fetch('/api/check-email-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to check email');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, checkEmail };
}
