import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoLink = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/fractional-garment-ownership/latest`,
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});