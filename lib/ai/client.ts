import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic client — server-side only.
 * Never import this in a client component.
 */
let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Model constants
export const MODELS = {
  /** High-volume daily tools: PWP, DWP */
  HAIKU: 'claude-haiku-4-5-20251001',
  /** Lesson AI tools: all 7 lesson-aligned tools */
  SONNET: 'claude-sonnet-4-6',
} as const;

export type ModelKey = keyof typeof MODELS;
