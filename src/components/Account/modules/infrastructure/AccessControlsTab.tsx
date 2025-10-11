import { AccessControlsTabProps } from "../../types";
import { useAccessControls } from "../../hooks/useAccessControls";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const AccessControlsTab = ({
  infrastructure,
  isOwner,
  dict,
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
  } = useAccessControls({ infrastructure, dict });

  if (!isOwner) {
    return (
      <div className="relative">
        <div className="relative z-10 p-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.accessControls}
          </h3>
          <p className="text-gris font-chicago text-sm">
            {dict?.onlySuperAdminAccess}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {infrastructure.isActive == false && (
        <div className="relative">
          <div className="relative z-10 p-4">
            <p className="text-white text-sm font-chicago">
              {dict?.infrastructureInactiveNotice}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="relative z-10 p-4 space-y-6">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.roleManagement}
          </h3>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.adminManagement}
            </h4>
            <div className="flex gap-3 mb-2 justify-between items-center">
              <FancyBorder
                type="diamond"
                color="oro"
                className="relative w-3/4"
              >
                <input
                  type="text"
                  value={adminAddress}
                  onChange={(e) => setAdminAddress(e.target.value)}
                  placeholder={dict?.enterAdminAddress}
                  className="relative w-full z-10 px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                />
              </FancyBorder>
              <div className="flex gap-3">
                <button
                  onClick={handleAddAdmin}
                  disabled={
                    !adminAddress ||
                    infrastructure.isActive == false ||
                    loading === "addAdmin"
                  }
                  className="relative"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "addAdmin" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.addAdmin}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleRemoveAdmin}
                  disabled={
                    !adminAddress ||
                    infrastructure.isActive == false ||
                    loading === "removeAdmin"
                  }
                  className="relative"
                >
                  <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "removeAdmin" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.removeAdmin}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.designerManagement}
            </h4>
            <div className="flex gap-3 mb-2 justify-between items-center">
              <FancyBorder
                color="oro"
                type="diamond"
                className="relative w-3/4"
              >
                <input
                  type="text"
                  value={designerAddress}
                  onChange={(e) => setDesignerAddress(e.target.value)}
                  placeholder={dict?.enterDesignerAddress}
                  className="relative w-full z-10 px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                />
              </FancyBorder>
              <div className="flex gap-3">
                <button
                  onClick={handleAddDesigner}
                  disabled={
                    !designerAddress ||
                    infrastructure.isActive == false ||
                    loading === "addDesigner"
                  }
                  className="relative"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "addDesigner" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.addDesigner}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleRemoveDesigner}
                  disabled={
                    !designerAddress ||
                    infrastructure.isActive == false ||
                    loading === "removeDesigner"
                  }
                  className="relative"
                >
                  <div className="text-xs text-fresa font-chicago relative lowercase w-full flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "removeDesigner" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.removeDesigner}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.supplierManagement}
            </h4>
            <div className="flex gap-3 mb-2 justify-between items-center">
              <FancyBorder
                color="oro"
                type="diamond"
                className="relative w-3/4"
              >
                <input
                  type="text"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  placeholder={dict?.enterSupplierAddress}
                  className="relative z-10 px-3 py-2 text-gris text-sm focus:outline-none w-full font-chicago placeholder:text-gris/50"
                />
              </FancyBorder>
              <div className="flex gap-3">
                <button
                  onClick={handleAddSupplier}
                  disabled={
                    !supplierAddress ||
                    infrastructure.isActive == false ||
                    loading === "addSupplier"
                  }
                  className="relative"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "addSupplier" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.addSupplier}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleRemoveSupplier}
                  disabled={
                    !supplierAddress ||
                    infrastructure.isActive == false ||
                    loading === "removeSupplier"
                  }
                  className="relative"
                >
                  <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "removeSupplier" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.removeSupplier}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.fulfillerManagement}
            </h4>
            <div className="flex gap-3 mb-2 justify-between items-center">
              <FancyBorder
                color="oro"
                type="diamond"
                className="relative w-3/4"
              >
                <input
                  type="text"
                  value={fulfillerAddress}
                  onChange={(e) => setFulfillerAddress(e.target.value)}
                  placeholder={dict?.enterFulfillerAddress}
                  className="relative w-full z-10 px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                />
              </FancyBorder>
              <div className="flex gap-3">
                <button
                  onClick={handleAddFulfiller}
                  disabled={
                    !fulfillerAddress ||
                    infrastructure.isActive == false ||
                    loading === "addFulfiller"
                  }
                  className="relative"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "addFulfiller" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.addFulfiller}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleRemoveFulfiller}
                  disabled={
                    !fulfillerAddress ||
                    infrastructure.isActive == false ||
                    loading === "removeFulfiller"
                  }
                  className="relative"
                >
                  <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading === "removeFulfiller" && (
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                      )}
                      {dict?.removeFulfiller}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.gatingControls}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-awk uppercase text-gris">
                  {dict?.designerGating}
                </span>
                <div className="relative w-fit">
                  <div
                    className={`text-xs font-chicago relative lowercase flex px-2 py-1 bg-offNegro ${
                      infrastructure.isDesignerGated === true ||
                      infrastructure.isDesignerGated == null
                        ? "text-fresa"
                        : "text-gris"
                    }`}
                  >
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">
                      {infrastructure.isDesignerGated === true ||
                      infrastructure.isDesignerGated == null
                        ? dict?.gatingApplied
                        : dict?.gatingDisabled}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleDesignerGating}
                disabled={
                  loading === "designerGating" ||
                  infrastructure.isActive == false
                }
                className="relative w-fit"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading === "designerGating" && (
                      <div className="relative w-fit animate-spin h-fit flex">
                        <div className="relative w-3 h-3 flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={"/images/scissors.png"}
                            draggable={false}
                            alt="loader"
                          />
                        </div>
                      </div>
                    )}
                    {infrastructure.isDesignerGated === true ||
                    infrastructure.isDesignerGated == null
                      ? dict?.disable
                      : dict?.enable}{" "}
                    {dict?.designerGating}
                  </span>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-awk uppercase text-gris">
                  {dict?.supplierGating}
                </span>
                <div className="relative w-fit">
                  <div
                    className={`text-xs font-chicago relative lowercase flex px-2 py-1 bg-offNegro ${
                      infrastructure.isSupplierGated === true ||
                      infrastructure.isSupplierGated == null
                        ? "text-fresa"
                        : "text-gris"
                    }`}
                  >
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">
                      {infrastructure.isSupplierGated === true ||
                      infrastructure.isSupplierGated == null
                        ? dict?.gatingApplied
                        : dict?.gatingDisabled}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleSupplierGating}
                disabled={
                  loading === "supplierGating" ||
                  infrastructure.isActive == false
                }
                className="relative w-fit"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading === "supplierGating" && (
                      <div className="relative w-fit animate-spin h-fit flex">
                        <div className="relative w-3 h-3 flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={"/images/scissors.png"}
                            draggable={false}
                            alt="loader"
                          />
                        </div>
                      </div>
                    )}
                    {infrastructure.isSupplierGated === true ||
                    infrastructure.isSupplierGated == null
                      ? dict?.disable
                      : dict?.enable}{" "}
                    {dict?.supplierGating}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.paymentTokenManagement}
          </h3>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-awk uppercase text-gris">
                {dict?.currentPaymentToken}
              </span>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-2 py-1 bg-offNegro ${
                    infrastructure.isPaymentTokenLocked
                      ? "text-fresa"
                      : "text-gris"
                  }`}
                >
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {infrastructure.isPaymentTokenLocked
                      ? dict?.locked
                      : dict?.unlocked}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gris font-pixel text-xs break-all">
              {infrastructure.paymentToken}
            </p>
          </div>

          {!infrastructure.isPaymentTokenLocked && (
            <div className="mb-4">
              <div className="flex gap-3 justify-between items-center">
                <FancyBorder
                  color="oro"
                  type="diamond"
                  className="relative w-3/4"
                >
                  <input
                    type="text"
                    value={newPaymentToken}
                    onChange={(e) => setNewPaymentToken(e.target.value)}
                    placeholder={dict?.enterNewPaymentTokenAddress}
                    className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                  />
                </FancyBorder>
                <button
                  onClick={handleUpdatePaymentToken}
                  disabled={
                    !newPaymentToken ||
                    infrastructure.isActive == false ||
                    loading !== null
                  }
                  className="relative"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">{dict?.updateToken}</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {!infrastructure.isPaymentTokenLocked && (
            <button
              onClick={handleLockPaymentToken}
              disabled={infrastructure.isActive == false || loading !== null}
              className="relative w-fit"
            >
              <div className="text-xs text-white font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">
                  {dict?.lockPaymentTokenPermanent ||
                    "lock payment token permanent"}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-6">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.infrastructureManagement}
          </h3>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.updateInfrastructureUri}
            </h4>
            <div className="mb-4">
              <p className="text-xs text-gris mb-3 font-chicago">
                {dict?.currentUri}: {infrastructure.uri}
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-awk uppercase text-gris mb-1">
                    {dict?.title}
                  </label>
                  <FancyBorder color="oro" type="diamond" className="relative">
                    <input
                      type="text"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      disabled={infrastructure.isActive == false}
                      className="relative z-10 px-3 py-2 text-gris text-sm focus:outline-none w-full font-chicago placeholder:text-gris/50 disabled:opacity-50"
                      placeholder={dict?.enterInfrastructureTitle}
                    />
                  </FancyBorder>
                </div>

                <div>
                  <label className="block text-xs font-awk uppercase text-gris mb-1">
                    {dict?.description}
                  </label>
                  <FancyBorder type="diamond" color="oro" className="relative">
                    <textarea
                      value={updateDescription}
                      onChange={(e) => setUpdateDescription(e.target.value)}
                      disabled={infrastructure.isActive == false}
                      rows={2}
                      className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50 resize-none disabled:opacity-50"
                      placeholder={dict?.enterInfrastructureDescription}
                    />
                  </FancyBorder>
                </div>

                <div>
                  <label className="block text-xs font-awk uppercase text-gris mb-1">
                    {dict?.imageOptional}
                  </label>
                  {infrastructure.metadata?.image && (
                    <div className="mb-2 text-xs text-gris font-chicago">
                      {dict?.current}:{" "}
                      {infrastructure.metadata.image.split("/").pop()}
                    </div>
                  )}
                  <FancyBorder type="diamond" color="oro" className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setUpdateImage(e.target.files?.[0] || null)
                      }
                      disabled={infrastructure.isActive == false}
                      className="relative w-full z-10 px-3 py-2 text-gris text-sm focus:outline-none font-chicago disabled:opacity-50"
                    />
                  </FancyBorder>
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
              className="relative w-fit"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10 flex items-center gap-2">
                  {loading === "updateURI" && (
                    <div className="relative w-fit animate-spin h-fit flex">
                      <div className="relative w-3 h-3 flex">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={"/images/scissors.png"}
                          draggable={false}
                          alt="loader"
                        />
                      </div>
                    </div>
                  )}
                  {dict?.updateInfrastructureURI}
                </span>
              </div>
            </button>
          </div>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.infrastructureStatus}
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                onClick={handleDeactivateInfrastructure}
                disabled={
                  infrastructure.isActive == false || loading === "deactivate"
                }
                className="relative w-fit"
              >
                <div className="text-xs text-white font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading === "deactivate" && (
                      <div className="relative w-fit animate-spin h-fit flex">
                        <div className="relative w-3 h-3 flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={"/images/scissors.png"}
                            draggable={false}
                            alt="loader"
                          />
                        </div>
                      </div>
                    )}
                    {dict?.deactivateInfrastructure ||
                      "deactivate infrastructure"}
                  </span>
                </div>
              </button>
              <button
                onClick={handleReactivateInfrastructure}
                disabled={infrastructure.isActive || loading === "reactivate"}
                className="relative w-fit"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading === "reactivate" && (
                      <div className="relative w-fit animate-spin h-fit flex">
                        <div className="relative w-3 h-3 flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={"/images/scissors.png"}
                            draggable={false}
                            alt="loader"
                          />
                        </div>
                      </div>
                    )}
                    {dict?.reactivateInfrastructure ||
                      "reactivate infrastructure"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-awk uppercase text-gris mb-3">
              {dict?.transferSuperAdmin}
            </h4>
            <div className="relative mb-3">
              <div className="relative z-10 p-4">
                <p className="text-white text-sm font-chicago">
                  {dict?.transferSuperAdminWarning ||
                    "warning: this action is permanent"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-between items-center">
              <FancyBorder
                type="diamond"
                color="oro"
                className="relative w-3/4"
              >
                <input
                  type="text"
                  value={newSuperAdmin}
                  onChange={(e) => setNewSuperAdmin(e.target.value)}
                  placeholder={dict?.enterNewSuperAdminAddress}
                  className="relative w-full z-10 px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                />
              </FancyBorder>
              <button
                onClick={handleTransferSuperAdmin}
                disabled={
                  !newSuperAdmin ||
                  loading === "transferSuperAdmin" ||
                  infrastructure.isActive == false
                }
                className="relative"
              >
                <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading === "transferSuperAdmin" && (
                      <div className="relative w-fit animate-spin h-fit flex">
                        <div className="relative w-3 h-3 flex">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={"/images/scissors.png"}
                            draggable={false}
                            alt="loader"
                          />
                        </div>
                      </div>
                    )}
                    {dict?.transfer}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.criticalActions}
          </h3>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-awk uppercase text-gris">
                {dict?.adminControlStatus}
              </span>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-2 py-1 bg-offNegro ${
                    infrastructure.adminControlRevoked
                      ? "text-fresa"
                      : "text-gris"
                  }`}
                >
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {infrastructure.adminControlRevoked
                      ? dict?.revoked
                      : dict?.active}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!infrastructure.adminControlRevoked && (
            <>
              <div className="relative mb-3">
                <div className="relative z-10 p-4">
                  <p className="text-fresa text-sm font-chicago">
                    {dict?.revokeAdminWarning ||
                      "warning: this action is permanent"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRevokeAdminControl}
                disabled={infrastructure.isActive == false || loading !== null}
                className="relative w-fit"
              >
                <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {dict?.revokeAdminControlPermanent ||
                      "revoke admin control permanent"}
                  </span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
