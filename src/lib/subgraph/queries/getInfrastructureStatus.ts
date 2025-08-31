import { graphFGOClient } from "@/lib/subgraph/clients/graphql";
import { gql } from "@apollo/client";

const GET_INFRASTRUCTURE_STATUS = `
  query($infraId: String!) {
    infrastructures(where: {infraId: $infraId}) {
      isActive
    }
  }
`;

export const getInfrastructureStatus = async (infraId: string): Promise<boolean> => {
  try {
    const result = await graphFGOClient.query({
      query: gql(GET_INFRASTRUCTURE_STATUS),
      variables: { infraId },
      fetchPolicy: "cache-first",
    });

    if (!result?.data?.infrastructures || result.data.infrastructures.length === 0) {
      return false;
    }

    return result.data.infrastructures[0]?.isActive !== false;
  } catch (error) {
    return false;
  }
};
