import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  CricketProviderFactory,
  UnsupportedProviderError,
  ProviderConfigurationError,
} from '../src/services/provider/factory';
import { MockCricketProvider } from '../src/services/provider/mockProvider';
import { AuthorizedPartnerProvider } from '../src/services/provider/partnerProvider';
import { ScraperBridgeProvider } from '../src/services/provider/scraperBridgeProvider';

describe('CricketProviderFactory', () => {
  beforeEach(() => {
    CricketProviderFactory.reset();
    delete process.env.CRICLIVE_DATA_PROVIDER;
    delete process.env.CRICKET_DATA_PROVIDER;
    delete process.env.CRICLIVE_PARTNER_API_KEY;
    delete process.env.CRICLIVE_SCRAPER_SERVICE_URL;
  });

  it('selects MockCricketProvider by default when no environment variable is provided', () => {
    const provider = CricketProviderFactory.getProvider();
    assert.equal(provider instanceof MockCricketProvider, true);
    assert.equal(provider.id, 'mock');
  });

  it('selects MockCricketProvider when CRICLIVE_DATA_PROVIDER is explicitly set to "mock"', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'mock';
    const provider = CricketProviderFactory.getProvider();
    assert.equal(provider instanceof MockCricketProvider, true);
    assert.equal(provider.id, 'mock');
  });

  it('instantiates AuthorizedPartnerProvider when configured with a valid API key', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'partner_api';
    process.env.CRICLIVE_PARTNER_API_KEY = 'secret_partner_key_xyz';

    const provider = CricketProviderFactory.getProvider();
    assert.equal(provider instanceof AuthorizedPartnerProvider, true);
    assert.equal(provider.id, 'partner_api');
  });

  it('throws ProviderConfigurationError when partner_api is requested without an API key', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'partner_api';

    assert.throws(
      () => {
        CricketProviderFactory.getProvider();
      },
      (err: unknown) => {
        assert.equal(err instanceof ProviderConfigurationError, true);
        assert.match((err as Error).message, /CRICLIVE_PARTNER_API_KEY is required/);
        return true;
      }
    );
  });

  it('instantiates ScraperBridgeProvider when configured with a valid service URL', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'scraper_bridge';
    process.env.CRICLIVE_SCRAPER_SERVICE_URL = 'http://localhost:5000';

    const provider = CricketProviderFactory.getProvider();
    assert.equal(provider instanceof ScraperBridgeProvider, true);
    assert.equal(provider.id, 'scraper_bridge');
  });

  it('throws ProviderConfigurationError when scraper_bridge is requested without a service URL', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'scraper_bridge';

    assert.throws(
      () => {
        CricketProviderFactory.getProvider();
      },
      (err: unknown) => {
        assert.equal(err instanceof ProviderConfigurationError, true);
        assert.match((err as Error).message, /CRICLIVE_SCRAPER_SERVICE_URL is required/);
        return true;
      }
    );
  });

  it('throws UnsupportedProviderError when an unknown provider is specified', () => {
    process.env.CRICLIVE_DATA_PROVIDER = 'fabricated_live_feed';

    assert.throws(
      () => {
        CricketProviderFactory.getProvider();
      },
      (err: unknown) => {
        assert.equal(err instanceof UnsupportedProviderError, true);
        const providerErr = err as UnsupportedProviderError;
        assert.equal(providerErr.requestedProvider, 'fabricated_live_feed');
        assert.deepEqual(providerErr.supportedProviders, ['mock', 'partner_api', 'scraper_bridge']);
        assert.match(providerErr.message, /Unsupported cricket data provider/);
        return true;
      }
    );
  });

  it('does NOT silently fall back to mock when an unsupported provider fails', () => {
    assert.throws(
      () => {
        CricketProviderFactory.getProvider({ providerName: 'unauthorized_scraper' });
      },
      {
        name: 'UnsupportedProviderError',
      }
    );
  });
});
