import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoLink = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/fractional-garment-ownership/v0.0.92`,
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});