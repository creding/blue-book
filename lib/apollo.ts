import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let apolloClient: ApolloClient<any> | null = null;

export function createApolloClient(
  supabaseUrl: string,
  supabaseKey: string,
  accessToken?: string
) {
  // Return existing client if it exists
  if (apolloClient) {
    return apolloClient;
  }
  const httpLink = createHttpLink({
    uri: `${supabaseUrl}/graphql/v1`,
    fetch: function (uri, options) {
      return fetch(uri, {
        ...(options ?? {}),
        headers: {
          ...(options?.headers ?? {}),
        },
        next: {
          revalidate: 0,
        },
      });
    },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        apikey: supabaseKey,
        Authorization: accessToken
          ? `Bearer ${accessToken}`
          : `Bearer ${supabaseKey}`,
        "X-Client-Info": "supabase-js/2.21.0",
      },
    };
  });

  apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });

  return apolloClient;
}

export function resetApolloCache() {
  if (apolloClient) {
    apolloClient.resetStore();
  }
}
