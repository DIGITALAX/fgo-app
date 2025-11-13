import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoLink = new HttpLink({
  uri: "/api/graphql/fgo",
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});
