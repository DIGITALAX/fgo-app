import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const GET_DESIGNER_CONTRACTS = `
query($designer: String!) {
  designers(where: {designer: $designer}) {
    parentContracts {
      id
      infraId
      deployer
      blockNumber
      blockTimestamp
      transactionHash
      contractAddress
      title
      symbol
      isActive
      scm
      parentURI
      designerContract
      parentMetadata {
        image
        title
        description
      }
    }
  }
}
`;

export const getDesignerContracts = async (designer: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_DESIGNER_CONTRACTS),
    variables: {
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

const GET_PARENT_CONTRACTS = `
query($infraId: String!) {
  parentContracts(where: { infraId: $infraId }) {
      id
      infraId
      deployer
      blockNumber
      blockTimestamp
      transactionHash
      contractAddress
      title
      symbol
      scm
      isActive
      parentURI
      designerContract
      parentMetadata {
        image
        title
        description
    }
  }
}
`;

export const getParentContracts = async (infraId: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_PARENT_CONTRACTS),
    variables: {
      infraId,
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

const GET_CHILD_CONTRACTS = `
query($infraId: String!) {
  childContracts(where: {infraId: $infraId}) {
      id
      deployer
      contractAddress
      childType
      infraId
      scm
      isActive
      symbol
      title
      transactionHash
      supplierContract
  }
}
`;

export const getChildContracts = async (infraId: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_CHILD_CONTRACTS),
    variables: {
      infraId,
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

const GET_TEMPLATE_CONTRACTS = `
query($infraId: String!) {
  templateContracts(where: {infraId: $infraId}) {   
      id
      deployer
      contractAddress
      childType
      infraId
      scm
      isActive
      symbol
      title
      transactionHash
      supplierContract
  }
}
`;

export const getTemplateContracts = async (infraId: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_TEMPLATE_CONTRACTS),
    variables: {
      infraId,
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

const GET_MARKET_CONTRACTS = `
query($infraId: String!) {
  marketContracts(where: { infraId: $infraId }) {
      id
      infraId
      deployer
      blockNumber
      blockTimestamp
      transactionHash
      contractAddress
      title
      fulfillerContract
      fulfillmentContract
      symbol
      marketURI
      marketMetadata {
        image
        title
        description
    }
  }
}
`;

export const getMarketContracts = async (infraId: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(GET_MARKET_CONTRACTS),
    variables: {
      infraId,
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

const CONTRACTS_BY_DESIGNER = `
query($id: String!) {
  fgousers(where: { id: $id }) {
    designerRoles {
      parentContracts {
        id
        infraId
        deployer
        blockNumber
        blockTimestamp
        transactionHash
        contractAddress
        title
        symbol
        scm
        parentURI
        designerContract
        parentMetadata {
          image
          title
          description
      }
      }
    }
  }
}
`;

export const getContractsByDesigner = async (id: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(CONTRACTS_BY_DESIGNER),
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

const CONTRACTS_BY_SUPPLIER = `
query($id: String!) {
  fgousers(where: { id: $id }) {
    supplierRoles {
      templateContracts {
        id
        deployer
        contractAddress
        childType
        infraId
        scm
        isActive
        symbol
        title
        transactionHash
        supplierContract
      }
      childContracts {
        id
        deployer
        isActive
        contractAddress
        childType
        infraId
        scm
        symbol
        title
        transactionHash
        supplierContract
      }
    }
  }
}
`;

export const getContractsBySupplier = async (id: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(CONTRACTS_BY_SUPPLIER),
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

const CONTRACTS_BY_FULFILLER = `
query($id: String!) {
  fgousers(where: { id: $id }) {
    fulfillerRoles {
      marketContracts {
        id
        infraId
        deployer
        blockNumber
        blockTimestamp
        transactionHash
        contractAddress
        title
        isActive
        symbol
        marketURI
        marketMetadata {
          image
          title
          description
        }
      }
    }
  }
}
`;

export const getContractsbyFulfiller = async (id: string): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(CONTRACTS_BY_FULFILLER),
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
