export const ROLES = {
  ADMIN: "admin",
  DESIGNER: "designer", 
  SUPPLIER: "supplier",
  FULFILLER: "fulfiller",
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const getRoleFunctionName = (role: RoleType, action: "add" | "remove"): string => {
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
  return `${action}${capitalizedRole}`;
};

export const CONTRACT_FUNCTIONS = {
  ACCESS_CONTROL: {
    TOGGLE_DESIGNER_GATING: "toggleDesignerGating",
    TOGGLE_SUPPLIER_GATING: "toggleSupplierGating",
    UPDATE_PAYMENT_TOKEN: "updatePaymentToken",
    LOCK_PAYMENT_TOKEN: "lockPaymentToken",
    REVOKE_ADMIN_CONTROL: "revokeAdminControl",
  },
  FACTORY: {
    UPDATE_INFRASTRUCTURE_URI: "updateInfrastructureURI",
    DEACTIVATE_INFRASTRUCTURE: "deactivateInfrastructure",
    REACTIVATE_INFRASTRUCTURE: "reactivateInfrastructure", 
    TRANSFER_SUPER_ADMIN: "transferSuperAdmin",
    DEPLOY_PARENT_CONTRACT: "deployParentContract",
    DEPLOY_MARKET_CONTRACT: "deployMarketContract",
    DEPLOY_CHILD_CONTRACT: "deployChildContract",
    DEPLOY_TEMPLATE_CONTRACT: "deployTemplateChildContract",
  },
} as const;

