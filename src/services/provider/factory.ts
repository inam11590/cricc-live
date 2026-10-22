/**
 * CricLive CricketDataProvider Factory
 * 
 * Selects and instantiates the configured cricket data provider based on runtime environment variables.
 * Enforces explicit configuration and fails fast on unsupported or misconfigured providers.
 * 
 * STRICT INTEGRATION BOUNDARY:
 * Silent fallbacks from production providers to mock data are strictly forbidden to ensure
 * data integrity and avoid presenting simulated scores as authentic live results.
 */

import { CricketDataProvider } from './types';
import { MockCricketProvider, MockProviderOptions } from './mockProvider';
import { AuthorizedPartnerProvider, PartnerProviderConfig } from './partnerProvider';
import { ScraperBridgeProvider, ScraperBridgeConfig } from './scraperBridgeProvider';

export class UnsupportedProviderError extends Error {
  readonly code = 'UNSUPPORTED_PROVIDER';
  readonly requestedProvider: string;
  readonly supportedProviders: string[];

  constructor(requested: string, supported: string[]) {
    super(
      `Unsupported cricket data provider: "${requested}". Supported providers for this environment are: [${supported.join(', ')}]. Check CRICLIVE_DATA_PROVIDER in your environment configuration.`
    );
    this.name = 'UnsupportedProviderError';
    this.requestedProvider = requested;
    this.supportedProviders = supported;
  }
}

export class ProviderConfigurationError extends Error {
  readonly code = 'PROVIDER_CONFIG_ERROR';
  constructor(message: string) {
    super(message);
    this.name = 'ProviderConfigurationError';
  }
}

export const SUPPORTED_PROVIDERS = ['mock', 'partner_api', 'scraper_bridge'] as const;
export type SupportedProviderType = typeof SUPPORTED_PROVIDERS[number];

export interface ProviderFactoryConfig {
  providerName?: string;
  mockOptions?: MockProviderOptions;
  partnerConfig?: PartnerProviderConfig;
  scraperConfig?: ScraperBridgeConfig;
}

export class CricketProviderFactory {
  private static instance: CricketDataProvider | null = null;
  private static currentProviderName: string | null = null;

  /**
   * Resolves the configured provider name from environment variables.
   * Checks CRICLIVE_DATA_PROVIDER first, falling back to legacy CRICKET_DATA_PROVIDER,
   * defaulting to 'mock'.
   */
  static resolveProviderName(): string {
    const envProvider =
      process.env.CRICLIVE_DATA_PROVIDER ||
      process.env.CRICKET_DATA_PROVIDER ||
      'mock';
    return envProvider.toLowerCase().trim();
  }

  /**
   * Instantiates or returns the singleton provider for the application runtime.
   */
  static getProvider(config: ProviderFactoryConfig = {}): CricketDataProvider {
    const targetProvider = config.providerName
      ? config.providerName.toLowerCase().trim()
      : this.resolveProviderName();

    // Return cached instance if provider selection has not changed and no custom options passed
    if (
      this.instance &&
      this.currentProviderName === targetProvider &&
      !config.mockOptions &&
      !config.partnerConfig &&
      !config.scraperConfig
    ) {
      return this.instance;
    }

    switch (targetProvider) {
      case 'mock': {
        const provider = new MockCricketProvider(config.mockOptions);
        if (!config.mockOptions) {
          this.instance = provider;
          this.currentProviderName = targetProvider;
        }
        return provider;
      }

      case 'partner_api': {
        const provider = new AuthorizedPartnerProvider(config.partnerConfig);
        if (!config.partnerConfig) {
          this.instance = provider;
          this.currentProviderName = targetProvider;
        }
        return provider;
      }

      case 'scraper_bridge': {
        const provider = new ScraperBridgeProvider(config.scraperConfig);
        if (!config.scraperConfig) {
          this.instance = provider;
          this.currentProviderName = targetProvider;
        }
        return provider;
      }

      default: {
        throw new UnsupportedProviderError(targetProvider, [...SUPPORTED_PROVIDERS]);
      }
    }
  }

  /**
   * Resets the singleton instance (primarily used for unit testing).
   */
  static reset(): void {
    this.instance = null;
    this.currentProviderName = null;
  }
}
