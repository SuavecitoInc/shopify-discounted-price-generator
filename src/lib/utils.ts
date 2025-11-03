import fetch from 'node-fetch';
import { STORE, API_VERSION, ACCESS_TOKEN } from './const';

type JsonResponse<T> = {
  data: T;
  errors?: GraphQLError[];
};

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

// Helper function to check if environment variables are set
export function validateShopifyConfig(): void {
  if (!STORE || !API_VERSION || !ACCESS_TOKEN) {
    throw new Error(
      'Missing required environment variables: SHOPIFY_STORE, SHOPIFY_ADMIN_API_VERSION, or SHOPIFY_ACCESS_TOKEN',
    );
  }
}

// Delay execution for a specified number of milliseconds
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calculate delay for rate limit retry
function calculateRetryDelay(retryAfter?: number): number {
  if (retryAfter) {
    return retryAfter * 1000; // Convert to milliseconds
  }
  return 2000; // Default 2 second delay
}

/**
 * Make an authenticated request to Shopify's GraphQL Admin API
 *
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @param retries - Number of retry attempts for rate limiting (default: 3)
 * @returns Promise resolving to the JSON response
 * @throws Error if the request fails after all retries
 */
export async function shopifyAuthenticatedFetch<T>(
  query: string,
  variables?: object,
  retries = 3,
): Promise<JsonResponse<T>> {
  const endpoint = `https://${STORE}.myshopify.com/admin/api/${API_VERSION}/graphql.json`;

  try {
    validateShopifyConfig();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      if (retries > 0) {
        const retryAfter = response.headers.get('Retry-After');
        const delayMs = calculateRetryDelay(
          retryAfter ? parseInt(retryAfter) : undefined,
        );

        console.warn(
          `Rate limited. Retrying in ${delayMs / 1000}s... (${retries} attempts remaining)`,
        );

        await delay(delayMs);
        return shopifyAuthenticatedFetch<T>(query, variables, retries - 1);
      }

      throw new Error('Rate limit exceeded - max retries reached');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
      );
    }

    const json = (await response.json()) as JsonResponse<T>;

    // Handle GraphQL errors
    if (json.errors && json.errors.length > 0) {
      const errorMessages = json.errors.map((e) => e.message).join(', ');

      console.error('GraphQL Errors:', json.errors);

      throw new Error(`GraphQL Error: ${errorMessages}`);
    }

    // Check for cost/throttle warnings
    const throttleStatus = json.errors?.[0]?.extensions?.cost?.throttleStatus;
    if (throttleStatus && throttleStatus.currentlyAvailable < 100) {
      console.warn(
        `API throttle status: ${throttleStatus.currentlyAvailable}/${throttleStatus.maximumAvailable} available`,
      );
    }

    return json;
  } catch (error: any) {
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Network error: Unable to connect to Shopify API');
      throw new Error(`Network error: ${error.message}`);
    }

    // Re-throw existing errors
    if (error.message) {
      throw error;
    }

    // Handle unexpected errors
    console.error('Unexpected error in shopifyAuthenticatedFetch:', error);
    throw new Error(`Unexpected error: ${error}`);
  }
}
