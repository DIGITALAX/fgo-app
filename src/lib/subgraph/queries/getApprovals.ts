import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const ALL_MARKETS = `
query {
  marketContracts(orderBy: blockTimestamp, orderDirection: desc) {
    contractAddress
    isActive
    title
    symbol
    marketURI
    marketMetadata {
      title
      description
      image
    }
    infraId
  }
}
`;


const ALL_MARKETS_WITH_SEARCH = `
query($first: Int!, $skip: Int!, $searchText: String!) {
  marketContracts(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {
    or: [
      { marketMetadata_: { title_contains_nocase: $searchText } },
      { marketMetadata_: { description_contains_nocase: $searchText } } ]
  }) {
    contractAddress
    isActive
    title
    symbol
    marketURI
    marketMetadata {
      title
      description
      image
    }
    infraId
  }
}
`;

export const getAllMarkets = async (
  first: number,
  skip: number,
  searchText?: string
): Promise<any> => {
  const useSearchQuery = searchText && searchText.trim().length > 0;
  const query = useSearchQuery ? ALL_MARKETS_WITH_SEARCH : ALL_MARKETS;
  const variables = useSearchQuery
    ? { first, skip, searchText: searchText.trim() }
    : { first, skip };

  const queryPromise = graphFGOClient.query({
    query: gql(query),
    variables,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

const ALL_TEMPLATES = `
query {
  templates(orderBy: blockTimestamp, orderDirection: desc) {
    uri
    metadata {
      title
      image
    }
    templateId
    templateContract
    status
  }
}
`;


const ALL_TEMPLATES_WITH_SEARCH = `
query($first: Int!, $skip: Int!, $searchText: String!) {
  templates(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {
    or: [
      { metadata_: { title_contains_nocase: $searchText } },
      { metadata_: { description_contains_nocase: $searchText } } ]
  }) {
    uri
    metadata {
      title
      image
    }
    templateId
    templateContract
    status    
  }
}
`;

export const getAllTemplates = async (
  first: number,
  skip: number,
  searchText?: string
): Promise<any> => {
  const useSearchQuery = searchText && searchText.trim().length > 0;
  const query = useSearchQuery ? ALL_TEMPLATES_WITH_SEARCH : ALL_TEMPLATES;
  const variables = useSearchQuery
    ? { first, skip, searchText: searchText.trim() }
    : { first, skip };

  const queryPromise = graphFGOClient.query({
    query: gql(query),
    variables,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};



const ALL_PARENTS = `
query {
  parents(orderBy: blockTimestamp, orderDirection: desc) {
    uri
    metadata {
      title
      image
    }
    designId
    parentContract
    status
  }
}
`;


const ALL_PARENTS_WITH_SEARCH = `
query($first: Int!, $skip: Int!, $searchText: String!) {
  parents(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {
    or: [
      { metadata_: { title_contains_nocase: $searchText } },
      { metadata_: { description_contains_nocase: $searchText } } ]
  }) {
    uri
    metadata {
      title
      image
    }
    designId
    parentContract
    status    
  }
}
`;

export const getAllParents = async (
  first: number,
  skip: number,
  searchText?: string
): Promise<any> => {
  const useSearchQuery = searchText && searchText.trim().length > 0;
  const query = useSearchQuery ? ALL_PARENTS_WITH_SEARCH : ALL_PARENTS;
  const variables = useSearchQuery
    ? { first, skip, searchText: searchText.trim() }
    : { first, skip };

  const queryPromise = graphFGOClient.query({
    query: gql(query),
    variables,
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
