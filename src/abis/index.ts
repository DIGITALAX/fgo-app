import FGOAccessControlABI from "./core/FGOAccessControl.json";
import FGOFulfillersABI from "./core/FGOFulfillers.json";
import FGOSuppliersABI from "./core/FGOSuppliers.json";
import FGODesignersABI from "./core/FGODesigners.json";
import FGOFactoryABI from "./core/FGOFactory.json";
import ERC20ABI from "./core/ERC20.json";

import FGOTemplateChildABI from "./children/FGOTemplateChild.json";
import FGOChildABI from "./children/FGOChild.json";
import FGOParentABI from "./parent/FGOParent.json";

export const ABIS = {
  FGOAccessControl: FGOAccessControlABI,
  FGOFulfillers: FGOFulfillersABI,
  FGOSuppliers: FGOSuppliersABI,
  FGODesigners: FGODesignersABI,
  FGOFactory: FGOFactoryABI,
  ERC20: ERC20ABI,
  FGOTemplateChild: FGOTemplateChildABI,
  FGOChild: FGOChildABI,
  FGOParent: FGOParentABI,
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};
