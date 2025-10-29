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
    futures {
      pricePerUnit
    }
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


const buildAdvancedQuery = (filters: any) => {
  const { searchText, orderBy, orderDirection, supplierAddress, availability, scm, minDigitalPrice, maxDigitalPrice, minPhysicalPrice, maxPhysicalPrice } = filters;
  
  let whereClause = "";
  const conditions = [];

  if (searchText && searchText.trim()) {
    conditions.push(`
      or: [
        { metadata_: { title_contains_nocase: "${searchText.trim()}" } },
        { metadata_: { description_contains_nocase: "${searchText.trim()}" } }
      ]
    `);
  }

  if (supplierAddress && supplierAddress.trim()) {
    conditions.push(`supplier: "${supplierAddress.trim()}"`);
  }

  if (availability !== null && availability !== undefined) {
    conditions.push(`availability: ${availability}`);
  }

  if (scm && scm.trim()) {
    conditions.push(`scm_contains_nocase: "${scm.trim()}"`);
  }

  if (minDigitalPrice && minDigitalPrice.trim()) {
    conditions.push(`digitalPrice_gte: "${minDigitalPrice.trim()}"`);
  }

  if (maxDigitalPrice && maxDigitalPrice.trim()) {
    conditions.push(`digitalPrice_lte: "${maxDigitalPrice.trim()}"`);
  }

  if (minPhysicalPrice && minPhysicalPrice.trim()) {
    conditions.push(`physicalPrice_gte: "${minPhysicalPrice.trim()}"`);
  }

  if (maxPhysicalPrice && maxPhysicalPrice.trim()) {
    conditions.push(`physicalPrice_lte: "${maxPhysicalPrice.trim()}"`);
  }

  if (conditions.length > 0) {
    whereClause = `where: { ${conditions.join(", ")} }`;
  }

  const orderClause = `orderBy: ${orderBy}, orderDirection: ${orderDirection}`;

  return `
    query($first: Int!, $skip: Int!) {
      childs(first: $first, skip: $skip, ${orderClause}${whereClause ? `, ${whereClause}` : ''}) {
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
        futures {
          pricePerUnit
        }
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
      templates(first: $first, skip: $skip, ${orderClause}${whereClause ? `, ${whereClause}` : ''}) {
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
};

export const getAllChildren = async (
  first: number,
  skip: number,
  filters?: any
): Promise<any> => {
  try {
    const query = filters ? buildAdvancedQuery(filters) : ALL_CHILDREN;
    const variables = { first, skip };

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
      console.error(result.errors);
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};
