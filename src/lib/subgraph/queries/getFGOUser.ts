import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const GET_FGO_USER = `
query($id: String!) {
  fgousers(where: {id: $id}) {
    id
    futureCredits {
      child {
        childId
        childContract
        metadata {
          title
          image
        }
      }
      position {
        pricePerUnit
        deadline
        isSettled
        isActive
        blockTimestamp
      }
      credits
      consumed
    }
    ownedInfrastructures {
      isDesignerGated
      isSupplierGated
      isPaymentTokenLocked
      adminControlRevoked
      accessControlContract
      designerContract
      fulfillerContract
      paymentToken
      superAdmin
      supplierContract
      uri
      deployer
      transactionHash
      isActive
      infraId
      metadata {
        title
        description
        image
      }
    }
    adminInfrastructures {
      isDesignerGated
      isSupplierGated
      isPaymentTokenLocked
      adminControlRevoked
      accessControlContract
      designerContract
      fulfillerContract
      paymentToken
      superAdmin
      supplierContract
      uri
      deployer
      transactionHash
      isActive
      infraId
      metadata {
        title
        description
        image
      }
    }
  }
}
`;

export const getFGOUser = async (id: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_FGO_USER),
    variables: {
      id,
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

const GET_DESIGNER = `
query($infraId: String!, $designer: String!) {
  designers(where: {infraId: $infraId, designer: $designer}) {
    infraId
    designerId
    designer
    blockNumber
    isActive
    blockTimestamp
    uri
    version
    metadata {
      title
      image
      link
      description
    }
  }
}
`;

export const getDesigner = async (
  infraId: string,
  designer: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_DESIGNER),
    variables: {
      infraId,
      designer,
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

const GET_SUPPLIER = `
query($infraId: String!, $supplier: String!) {
  suppliers(where: {infraId: $infraId, supplier: $supplier}) {
    infraId
    supplierId
    supplier
    blockNumber
    isActive
    blockTimestamp
    uri
    version
    metadata {
      title
      image
      link
      description
    }
  }
}
`;

export const getSupplier = async (
  infraId: string,
  supplier: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_SUPPLIER),
    variables: {
      infraId,
      supplier,
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

const GET_FULFILLER = `
query($infraId: String!, $fulfiller: String!) {
  fulfillers(where: {infraId: $infraId, fulfiller: $fulfiller}) {
    infraId
    fulfillerId
    fulfiller
    blockNumber
    isActive
    blockTimestamp
    uri
    vigBasisPoints
    basePrice
    version
    metadata {
      title
      image
      link
      description
    }
  }
}
`;

export const getFulfiller = async (
  infraId: string,
  fulfiller: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_FULFILLER),
    variables: {
      infraId,
      fulfiller,
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

const GET_FULFILLERS_ALL = `
query($skip: Int!, $first: Int!, $infraId: String!) {
  fulfillers(skip: $skip, first: $first, where: {infraId: $infraId}) {
    infraId
    fulfillerId
    fulfiller
    blockNumber
    isActive
    blockTimestamp
    uri
    basePrice
    vigBasisPoints
    transactionHash
    accessControlContract
    version
    metadata {
      title
      image
      link
      description
    }
  }
}
`;

export const getAllFulfillers = async (
  first: number,
  skip: number,
  infraId: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_FULFILLERS_ALL),
    variables: {
      first,
      skip,
      infraId
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
