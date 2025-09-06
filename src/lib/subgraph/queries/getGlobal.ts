import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const ALL_CHILDREN = `
query($first: Int!, $skip: Int!) {
  childs(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    createdAt
    uri
    status
    supplier
    scm
    infraCurrency
    physicalPrice
    digitalPrice
    supplyCount
    availability
    childId
    childContract
    supplierProfile {
      uri 
      metadata {
        title
      }
    }
    metadata {
      title
      image
    }
  }
  templates(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    createdAt
    uri
    templateId
    templateContract
    status
    scm
    supplier
    availability
    physicalPrice
    digitalPrice
    supplyCount
    infraCurrency
    supplierProfile {
      uri 
      metadata {
        title
      }
    }
    metadata {
      title
      image
    }
  }
}
`;

const ALL_CHILDREN_WITH_SEARCH = `
query($first: Int!, $skip: Int!, $searchText: String!) {
  childs(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {
    or: [
      { metadata_: { title_contains_nocase: $searchText } },
      { metadata_: { description_contains_nocase: $searchText } }
    ]
  }) {
    createdAt
    uri
    childId
    childContract
    status
    physicalPrice
    digitalPrice
    supplyCount
    infraCurrency
    supplier
    scm
    availability
    supplierProfile {
      uri 
      metadata {
        title
      }
    }
    metadata {
      title
      image
    }
  }
  templates(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: {
    or: [
      { metadata_: {title_contains_nocase: $searchText} }
    ]
  }) {
    createdAt
    uri
    templateId
    templateContract
    infraCurrency
    status
    supplier
    scm
    physicalPrice
    availability
    digitalPrice
    supplyCount
    supplierProfile {
      uri 
      metadata {
        title
      }
    }
    metadata {
      title
      image
     }
  }
}
`;

export const getAllChildren = async (
  first: number,
  skip: number,
  searchText?: string
): Promise<any> => {
  try {
    const useSearchQuery = searchText && searchText.trim().length > 0;
    const query = useSearchQuery ? ALL_CHILDREN_WITH_SEARCH : ALL_CHILDREN;
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
    }
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};
