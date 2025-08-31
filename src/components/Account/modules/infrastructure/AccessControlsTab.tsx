import { AccessControlsTabProps } from "../../types";
import { useAccessControls } from "../../hooks/useAccessControls";

export const AccessControlsTab = ({
  infrastructure,
  isOwner,
}: AccessControlsTabProps) => {
  const {
    adminAddress,
    setAdminAddress,
    designerAddress,
    setDesignerAddress,
    supplierAddress,
    setSupplierAddress,
    fulfillerAddress,
    setFulfillerAddress,
    newPaymentToken,
    setNewPaymentToken,
    newSuperAdmin,
    setNewSuperAdmin,
    loading,
    updateTitle,
    setUpdateTitle,
    updateDescription,
    setUpdateDescription,
    setUpdateImage,
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddDesigner,
    handleRemoveDesigner,
    handleAddSupplier,
    handleRemoveSupplier,
    handleAddFulfiller,
    handleRemoveFulfiller,
    handleToggleDesignerGating,
    handleToggleSupplierGating,
    handleUpdatePaymentToken,
    handleLockPaymentToken,
    handleRevokeAdminControl,
    handleUpdateInfrastructureURI,
    handleDeactivateInfrastructure,
    handleReactivateInfrastructure,
    handleTransferSuperAdmin,
  } = useAccessControls({ infrastructure });

  if (!isOwner) {
    return (
      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Access Controls</h3>
        <p className="text-ama font-herm">
          You must be the Super Admin to manage access controls.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {infrastructure.isActive == false && (
        <div className="bg-black border border-ama p-4 rounded-sm">
          <p className="text-ama text-sm font-herm">
             Infrastructure is inactive. All admin functions are disabled until reactivated.
          </p>
        </div>
      )}

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Role Management</h3>

        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Admin Management</h4>
          <div className="flex gap-3 mb-2">
            <input
              type="text"
              value={adminAddress}
              onChange={(e) => setAdminAddress(e.target.value)}
              placeholder="Enter admin address"
              className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
            />
            <button
              onClick={handleAddAdmin}
              disabled={
                !adminAddress ||
                infrastructure.isActive == false ||
                loading === "addAdmin"
              }
              className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "addAdmin" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Add Admin
            </button>
            <button
              onClick={handleRemoveAdmin}
              disabled={
                !adminAddress ||
                infrastructure.isActive == false ||
                loading === "removeAdmin"
              }
              className="px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "removeAdmin" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Remove Admin
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Designer Management</h4>
          <div className="flex gap-3 mb-2">
            <input
              type="text"
              value={designerAddress}
              onChange={(e) => setDesignerAddress(e.target.value)}
              placeholder="Enter designer address"
              className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
            />
            <button
              onClick={handleAddDesigner}
              disabled={
                !designerAddress ||
                infrastructure.isActive == false ||
                loading === "addDesigner"
              }
              className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "addDesigner" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Add Designer
            </button>
            <button
              onClick={handleRemoveDesigner}
              disabled={
                !designerAddress ||
                infrastructure.isActive == false ||
                loading === "removeDesigner"
              }
              className="px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "removeDesigner" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Remove Designer
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Supplier Management</h4>
          <div className="flex gap-3 mb-2">
            <input
              type="text"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              placeholder="Enter supplier address"
              className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
            />
            <button
              onClick={handleAddSupplier}
              disabled={
                !supplierAddress ||
                infrastructure.isActive == false ||
                loading === "addSupplier"
              }
              className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "addSupplier" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Add Supplier
            </button>
            <button
              onClick={handleRemoveSupplier}
              disabled={
                !supplierAddress ||
                infrastructure.isActive == false ||
                loading === "removeSupplier"
              }
              className="px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "removeSupplier" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Remove Supplier
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-ama font-herm mb-3">Fulfiller Management</h4>
          <div className="flex gap-3 mb-2">
            <input
              type="text"
              value={fulfillerAddress}
              onChange={(e) => setFulfillerAddress(e.target.value)}
              placeholder="Enter fulfiller address"
              className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
            />
            <button
              onClick={handleAddFulfiller}
              disabled={
                !fulfillerAddress ||
                infrastructure.isActive == false ||
                loading === "addFulfiller"
              }
              className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "addFulfiller" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Add Fulfiller
            </button>
            <button
              onClick={handleRemoveFulfiller}
              disabled={
                !fulfillerAddress ||
                infrastructure.isActive == false ||
                loading === "removeFulfiller"
              }
              className="px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "removeFulfiller" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Remove Fulfiller
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Gating Controls</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-ama font-herm">Designer Gating</span>
              <span
                className={`px-2 py-1 rounded-sm text-xs font-herm ${
                  infrastructure.isDesignerGated === true ||
                  infrastructure.isDesignerGated == null
                    ? "bg-fresa text-white"
                    : "bg-mar text-black"
                }`}
              >
                {infrastructure.isDesignerGated === true ||
                infrastructure.isDesignerGated == null
                  ? "Gating Applied"
                  : "Gating Disabled"}
              </span>
            </div>
            <button
              onClick={handleToggleDesignerGating}
              disabled={
                loading === "designerGating" || infrastructure.isActive == false
              }
              className="w-full px-4 py-2 bg-white hover:opacity-70 disabled:bg-ama disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading === "designerGating" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              {infrastructure.isDesignerGated === true ||
              infrastructure.isDesignerGated == null
                ? "Disable"
                : "Enable"}{" "}
              Designer Gating
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-ama font-herm">Supplier Gating</span>
              <span
                className={`px-2 py-1 rounded-sm text-xs font-herm ${
                  infrastructure.isSupplierGated === true ||
                  infrastructure.isSupplierGated == null
                    ? "bg-fresa text-white"
                    : "bg-mar text-black"
                }`}
              >
                {infrastructure.isSupplierGated === true ||
                infrastructure.isSupplierGated == null
                  ? "Gating Applied"
                  : "Gating Disabled"}
              </span>
            </div>
            <button
              onClick={handleToggleSupplierGating}
              disabled={
                loading === "supplierGating" || infrastructure.isActive == false
              }
              className="w-full px-4 py-2 bg-white hover:opacity-70 disabled:bg-ama disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading === "supplierGating" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              {infrastructure.isSupplierGated === true ||
              infrastructure.isSupplierGated == null
                ? "Disable"
                : "Enable"}{" "}
              Supplier Gating
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Payment Token Management</h3>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ama font-herm">Current Payment Token</span>
            <span
              className={`px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.isPaymentTokenLocked
                  ? "bg-fresa text-white"
                  : "bg-mar text-black"
              }`}
            >
              {infrastructure.isPaymentTokenLocked ? "Locked" : "Unlocked"}
            </span>
          </div>
          <p className="text-white font-mono text-sm break-all">
            {infrastructure.paymentToken}
          </p>
        </div>

        {!infrastructure.isPaymentTokenLocked && (
          <div className="mb-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newPaymentToken}
                onChange={(e) => setNewPaymentToken(e.target.value)}
                placeholder="Enter new payment token address"
                className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
              />
              <button
                onClick={handleUpdatePaymentToken}
                disabled={
                  !newPaymentToken ||
                  infrastructure.isActive == false ||
                  loading !== null
                }
                className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors"
              >
                Update Token
              </button>
            </div>
          </div>
        )}

        {!infrastructure.isPaymentTokenLocked && (
          <button
            onClick={handleLockPaymentToken}
            disabled={infrastructure.isActive == false || loading !== null}
            className="w-full px-4 py-2 bg-ama hover:opacity-70 disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors"
          >
            Lock Payment Token (Permanent)
          </button>
        )}
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Infrastructure Management</h3>

        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Update Infrastructure URI</h4>
          <div className="mb-4">
            <p className="text-xs text-ama mb-3 font-herm">
              Current URI: {infrastructure.uri}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-herm text-ama mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  disabled={infrastructure.isActive == false}
                  className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama disabled:bg-black disabled:text-ama font-herm"
                  placeholder="Enter infrastructure title"
                />
              </div>

              <div>
                <label className="block text-sm font-herm text-ama mb-1">
                  Description
                </label>
                <textarea
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  disabled={infrastructure.isActive == false}
                  rows={2}
                  className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama disabled:bg-black disabled:text-ama resize-none font-herm"
                  placeholder="Enter infrastructure description"
                />
              </div>

              <div>
                <label className="block text-sm font-herm text-ama mb-1">
                  Image (optional)
                </label>
                {infrastructure.metadata?.image && (
                  <div className="mb-2 text-xs text-white/60 font-herm">
                    Current: {infrastructure.metadata.image.split('/').pop()}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdateImage(e.target.files?.[0] || null)}
                  disabled={infrastructure.isActive == false}
                  className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama disabled:bg-black disabled:text-ama font-herm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdateInfrastructureURI}
            disabled={
              !updateTitle.trim() ||
              !updateDescription.trim() ||
              infrastructure.isActive == false ||
              loading === "updateURI"
            }
            className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
          >
            {loading === "updateURI" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            )}
            Update Infrastructure URI
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Infrastructure Status</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={handleDeactivateInfrastructure}
              disabled={
                infrastructure.isActive == false || loading === "deactivate"
              }
              className="px-4 py-2 bg-ama hover:opacity-70 disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading === "deactivate" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Deactivate Infrastructure
            </button>
            <button
              onClick={handleReactivateInfrastructure}
              disabled={infrastructure.isActive || loading === "reactivate"}
              className="px-4 py-2 bg-mar hover:bg-ama disabled:bg-white disabled:text-black text-black text-sm font-herm rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading === "reactivate" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              Reactivate Infrastructure
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-ama font-herm mb-3">Transfer Super Admin</h4>
          <div className="bg-black border border-ama rounded-sm p-4 mb-3">
            <p className="text-ama text-sm font-herm">
               Warning: This will transfer Super Admin rights to another address. You will no longer be the Super Admin.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newSuperAdmin}
              onChange={(e) => setNewSuperAdmin(e.target.value)}
              placeholder="Enter new Super Admin address"
              className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
            />
            <button
              onClick={handleTransferSuperAdmin}
              disabled={
                !newSuperAdmin ||
                loading === "transferSuperAdmin" ||
                infrastructure.isActive == false
              }
              className="px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-2"
            >
              {loading === "transferSuperAdmin" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Critical Actions</h3>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ama font-herm">Admin Control Status</span>
            <span
              className={`px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.adminControlRevoked
                  ? "bg-fresa text-white"
                  : "bg-mar text-black"
              }`}
            >
              {infrastructure.adminControlRevoked ? "Revoked" : "Active"}
            </span>
          </div>
        </div>

        {!infrastructure.adminControlRevoked && (
          <div className="bg-black border border-fresa rounded-sm p-4">
            <p className="text-fresa text-sm mb-3 font-herm">
               Warning: This action is permanent and cannot be undone. You will lose all administrative control over this infrastructure.
            </p>
            <button
              onClick={handleRevokeAdminControl}
              disabled={infrastructure.isActive == false || loading !== null}
              className="w-full px-4 py-2 bg-fresa hover:bg-ama disabled:bg-white disabled:text-black text-white text-sm font-herm rounded-sm transition-colors"
            >
              Revoke Admin Control (Permanent)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};