import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const PARENTS = `
query($parentContract: String!, $first: Int!, $skip: Int!) {
  parents(where: {parentContract: $parentContract}, orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
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

export const getParents = async (parentContract: string, first: number = 20, skip: number = 0): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(PARENTS),
    variables: {
      parentContract,
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

const CHILDREN = `
query($childContract: String!, $first: Int!, $skip: Int!) {
  childs(where: {childContract: $childContract}, orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    createdAt
    uri
    status
    infraCurrency
    physicalPrice
    digitalPrice
    supplyCount
    totalPrepaidAmount
    totalPrepaidUsed
    totalReservedSupply
    futures {
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      deadline
      isSettled
      isActive
      purchases {
        amount
        totalCost
        buyer
        blockNumber
        blockTimestamp
        transactionHash
      }
      blockNumber
      blockTimestamp
      transactionHash
      settlements {
        future
        buyer
        credits
        blockNumber
        blockTimestamp
        transactionHash
      }
      closed
      closedBlockNumber
      closedBlockTimestamp
      closedTransactionHash
    }
    childId
    usageCount
    availability
    scm
    childContract
    supplier
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

export const getChildren = async (childContract: string, first: number = 20, skip: number = 0): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(CHILDREN),
    variables: {
      childContract,
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

const TEMPLATES = `
query($templateContract: String!, $first: Int!, $skip: Int!) {
  templates(where: {templateContract: $templateContract}, orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    createdAt
    uri
    templateId
    infraId
    templateContract
    supplier
    infraCurrency
    status
    scm
    availability
    physicalPrice
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

export const getTemplates = async (templateContract: string, first: number = 20, skip: number = 0): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(TEMPLATES),
    variables: {
      templateContract,
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

const PARENT = `
query($designId: Int!, $parentContract: String!) {
  parents(where: {designId: $designId, parentContract: $parentContract}, orderBy: blockTimestamp, orderDirection: desc) {
    infraId
    designId
    parentContract
    designer
    designerProfile {
      uri
      metadata {
        title
        description
        image
      }
    }
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    printType
    availability
    infraCurrency
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    authorizedMarkets {
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
    status
    totalPurchases
    maxDigitalEditions
    maxPhysicalEditions
    currentDigitalEditions
    currentPhysicalEditions
    supplyRequests {
      id
      existingChildId
      quantity
      preferredMaxPrice
      deadline
      existingChildContract
      isPhysical
      fulfilled
      customSpec
      placementURI
    }
    childReferences {
      childContract
      childId
      amount
      placementURI
      isTemplate
      prepaidAmount
      prepaidUsed
      childTemplate {
        uri
        metadata {
          title
          image
        }
      }
      child {
        uri
        metadata {
          title 
          image
        }
      }
    }
    tokenIds
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    uri
    metadata {
      id
      title
      description
      image
      tags
      prompt
      attachments {
        uri
        type
      }
      aiModel
      loras
      workflow
      version
    }
    marketRequests {
      tokenId
      marketContract
      isPending
      approved
      timestamp
    }
    authorizedChildren {
      childContract
      childId
      uri
      futures {
        id
      }
      metadata {
        image
        title
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      availability
      uri
      metadata {
        title
        image
      }
    }
    workflow {
      estimatedDeliveryDuration
      digitalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
      physicalSteps {
        instructions
        fulfiller {
          fulfiller
          uri
          isActive
          basePrice
          vigBasisPoints
          metadata {
            title
            image
          }
        }
        subPerformers {
          performer
          splitBasisPoints
        }
      }
    }
  }
}
`;

export const getParent = async (
  designId: number,
  parentContract: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(PARENT),
    variables: {
      designId,
      parentContract,
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

const TEMPLATE = `
query($templateId: Int!, $templateContract: String!) {
  templates(where: {templateId: $templateId, templateContract: $templateContract}, orderBy: blockTimestamp, orderDirection: desc) {
    templateId
    templateContract
    supplier 
    supplierProfile {
      uri
      version
      metadata {
        image
        title
        description
        link
      }
    }
    childType
    scm
    title
    symbol
    digitalPrice
    physicalPrice
    version
    maxPhysicalEditions
    maxDigitalEditions
    currentPhysicalEditions
    uriVersion
    usageCount
    supplyCount
    infraCurrency
    uri
    metadata
    status
    availability
    isImmutable
    infraId
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    digitalReferencesOpenToAll
    physicalReferencesOpenToAll
    standaloneAllowed
    authorizedMarkets {
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
    childReferences {
      childContract
      childId
      placementURI
      amount
      isTemplate
      prepaidAmount
      prepaidUsed
      childTemplate {
        uri
        metadata {
          title
          image
        }
      }
      child {
        uri
        metadata {
          title
          image
        }
      }
    }
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    authorizedParents {
      parentContract
      designId
      uri
      availability
      metadata {
        title
        image
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      uri
      availability
      metadata {
        title
        image
      }
    }
    parentRequests {
      childId
      requestedAmount
      parentId
      parentContract
      isPending
      approved
      approvedAmount
      timestamp
      isPhysical
      parent {
        uri 
        availability
        metadata {
          image
          title
        }
      }
    }
    templateRequests {
      childId
      requestedAmount
      templateId
      templateContract
      isPending
      approved
      approvedAmount
      timestamp
      isPhysical
      template {
        uri
        availability
        metadata {
          image
          title
        }
      }
    }
    marketRequests {
      tokenId
      marketContract
      isPending 
      approved
      timestamp
    }
    authorizedChildren {
      childContract
      childId
      uri
      futures {
        id
      }
      metadata {
        title
        image
      }
    }
    physicalRights {
      buyer
      child {
        childId
        childContract
        uri
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getTemplate = async (
  templateId: number,
  templateContract: string
): Promise<any> => {
  const queryPromise = graphFGOClient.query({
    query: gql(TEMPLATE),
    variables: {
      templateId,
      templateContract,
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

const CHILD = `
query($childId: Int!, $childContract: String!) {
  childs(where: {childId: $childId, childContract: $childContract}, orderBy: blockTimestamp, orderDirection: desc) {
    childId
    infraId
    childContract
    supplier 
    supplierProfile {
      uri
      version
      metadata {
        image
        title
        description
        link
      }
    }
    childType
    scm
    title
    totalPrepaidAmount
    totalPrepaidUsed
    totalReservedSupply
    futures {
      supplier
      totalAmount
      soldAmount
      pricePerUnit
      deadline
      isSettled
      isActive
      purchases {
        amount
        totalCost
        buyer
        blockNumber
        blockTimestamp
        transactionHash
      }
      blockNumber
      blockTimestamp
      transactionHash
      settlements {
        future
        buyer
        credits
        blockNumber
        blockTimestamp
        transactionHash
      }
      closed
      closedBlockNumber
      closedBlockTimestamp
      closedTransactionHash
    }
    symbol
    digitalPrice
    physicalPrice
    version
    maxPhysicalEditions
    currentPhysicalEditions
    uriVersion
    usageCount
    supplyCount
    infraCurrency
    uri
    metadata
    status
    availability
    isImmutable
    digitalMarketsOpenToAll
    physicalMarketsOpenToAll
    digitalReferencesOpenToAll
    physicalReferencesOpenToAll
    standaloneAllowed
    authorizedMarkets {
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
    createdAt
    updatedAt
    blockNumber
    blockTimestamp
    transactionHash
    authorizedParents {
      parentContract
      designId
      uri
      availability
      metadata {
        title
        image
      }
    }
    authorizedTemplates {
      templateContract
      templateId
      uri
      availability
      metadata {
        title
        image
      }
    }
    parentRequests {
      childId
      requestedAmount
      parentId
      parentContract
      isPending
      approved
      approvedAmount
      timestamp
      isPhysical
      parent {
        uri 
        availability
        metadata {
          image
          title
        }
      }
    }
    templateRequests {
      childId
      requestedAmount
      templateId
      templateContract
      isPending
      approved
      approvedAmount
      timestamp
      isPhysical
      template {
        uri
        availability
        metadata {
          image
          title
        }
      }
    }
    marketRequests {
      tokenId
      marketContract
      isPending 
      approved
      timestamp
    }
    physicalRights {
      buyer
      child {
        childId
        childContract
        uri
        metadata {
          title
          image
        }
      }
    }
  }
}
`;

export const getChild = async (
  childId: number,
  childContract: string
): Promise<any> => {
  try {
    const queryPromise = graphFGOClient.query({
      query: gql(CHILD),
      variables: {
        childId,
        childContract,
      },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Query timed out after 10 seconds"));
      }, 10000);
    });

    const result: any = await Promise.race([queryPromise, timeoutPromise]);
    return result;
  } catch (error) {
    throw error;
  }
};
