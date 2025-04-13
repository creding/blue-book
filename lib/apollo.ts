import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export function createApolloClient(supabaseUrl: string, supabaseKey: string, accessToken?: string) {
  const httpLink = createHttpLink({
    uri: `${supabaseUrl}/graphql/v1`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        apikey: supabaseKey,
        Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${supabaseKey}`,
        "X-Client-Info": "supabase-js/2.21.0",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
