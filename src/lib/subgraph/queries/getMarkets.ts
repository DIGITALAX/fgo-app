import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const ALL_FUTURES = `
query($first: Int!, $skip: Int!) {
  futurePositions(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    supplier
    supplierProfile {
        metadata {
            title
        }
    }
    pricePerUnit
    deadline
    isSettled
    isActive
    child {
        childId
        childContract
        infraCurrency
        metadata {
            title
            image
        }
    }
    blockTimestamp
    closed
  }
}
`;

export const getAllFutures = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ALL_FUTURES),
    variables: {
      first,
      skip,
    },
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

const ALL_SUPPLY_REQUESTS = `
query($first: Int!, $skip: Int!) {
  childSupplyRequests(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
    quantity
    preferredMaxPrice
    deadline
    isPhysical
    paid
    blockTimestamp
    customSpec
  }
}
`;

export const getAllSupplyRequests = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ALL_SUPPLY_REQUESTS),
    variables: {
      first,
      skip,
    },
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

const SUPPLY_REQUEST = `
query($id: String!) {
  childSupplyRequests(id: $id) {
    existingChildId
    existingChild {
      childId
      childContract
      uri
      metadata {
        image
        title
      }
    }
    quantity
    preferredMaxPrice
    deadline
    existingChildContract
    isPhysical
    expired
    customSpec
    placementURI
    parent {
      designId
      designer
      infraCurrency
      parentContract
      uri
      digitalPrice
      physicalPrice
      maxDigitalEditions
      maxPhysicalEditions
      availability
      metadata {
        image 
        title
      }
    }
    proposals {
      childId
      timestamp
      childContract
      supplier
      blockNumber
      blockTimestamp
      transactionHash
      positionId
      child {
        uri
        digitalPrice
        physicalPrice
        availability
        metadata {
          image
          title
        }
      }
    }
    matchedChildId
    matchedSupplier
    matchedChildContract
    matchedChild {
      uri
      availability
      digitalPrice
      physicalPrice
      metadata {
        title
        image
      }
    }
    paid
    blockNumber
    blockTimestamp
    transactionHash
    paidBlockNumber
    paidBlockTimestamp
    paidTransactionHash
  }
}
`;

export const getSupplyRequest = async (id: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(SUPPLY_REQUEST),
    variables: {
     id
    },
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

const ALL_MARKETS_ACTIVE = `
query($first: Int!, $skip: Int!) {
  childs(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: { and: [ { status: 2 }, { standAlone: true }, { authorizedMarkets_not: [] }] }) {
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
  templates(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: { and: [ { status: 2 }, { standAlone: true }, { authorizedMarkets_not: [] }] }) {
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
  parents(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: { and: [ { status: 2 }, { authorizedMarkets_not: [] }] }) {
    designId
    parentContract
    designerProfile {
      uri
      metadata {
        title
      }
    }
    infraCurrency
    digitalPrice
    physicalPrice
    status
    metadata {
      image
      title
    }
    uri
  }
}
`;

export const getAllMarketsActive = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(ALL_MARKETS_ACTIVE),
    variables: {
      first,
      skip,
    },
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



const SUPPLIER_CHILDREN = `
query($first: Int!, $skip: Int!, supplier: String!) {
  childs(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc, where: { supplier: $supplier }) {
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
}
`;

export const getSupplierChildren = async (
  first: number,
  skip: number,
  supplier: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(SUPPLIER_CHILDREN),
    variables: {
      first,
      skip,
      supplier
    },
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
