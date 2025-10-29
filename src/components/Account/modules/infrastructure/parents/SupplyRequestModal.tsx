import { SupplyRequestModalProps } from "../../../types";
import { useSupplyRequestModal } from "../../../hooks/infrastructure/parents/useSupplyRequestModal";
import { useChildSelection } from "../../../hooks/infrastructure/children/useChildSelection";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { Child, Template } from "@/components/Item/types";

export const SupplyRequestModal = ({
  isOpen,
  onClose,
  onSelect,
  onCancel,
  dict,
  editingRequest,
}: SupplyRequestModalProps) => {
  const {
    configuring,
    quantity,
    handleQuantityChange,
    preferredMaxPrice,
    handlePreferredMaxPriceChange,
    deadline,
    handleDeadlineChange,
    customSpec,
    setCustomSpec,
    instructions,
    setInstructions,
    customFields,
    isPhysical,
    setIsPhysical,
    handleSelectChild,
    handleCancel,
    handleConfirmSelection,
    addCustomField,
    updateCustomField,
    removeCustomField,
    getFilteredItems,
    getItemTitle,
    minDeadline,
  } = useSupplyRequestModal({
    isOpen,
    onClose,
    onSelect,
    onCancel,
    dict,
    editingRequest,
  });

  const {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    searchText,
    handleSearch,
  } = useChildSelection(dict);
  const filteredItems = getFilteredItems(
    items.filter(
      (item) =>
        !(item as Child)?.futures?.pricePerUnit &&
        !(item as Template).templateId
    ) as Child[]
  );

  if (!isOpen) return null;

  if (configuring) {
    const itemTitle = getItemTitle(configuring);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          <div className="relative z-10 p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-awk uppercase text-oro">
                  {dict?.configureSupplyRequest}
                </h2>
                <p className="text-white text-sm mt-1 font-chicago">
                  {itemTitle}
                </p>
              </div>
              <div
                onClick={
                  editingRequest ? onClose : () => handleSelectChild(null)
                }
                className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
              >
                <Image
                  src={"/images/plug.png"}
                  draggable={false}
                  fill
                  objectFit="contain"
                  alt="close"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.type} *
              </label>
              <div className="flex gap-3">
                <div
                  onClick={() => setIsPhysical(true)}
                  className={`relative cursor-pointer flex-1 px-4 py-2 text-center font-chicago text-sm transition-all ${
                    isPhysical
                      ? "text-oro bg-offNegro"
                      : "text-gris bg-offNegro opacity-50"
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
                  <span className="relative z-10">{dict?.physical}</span>
                </div>
                <div
                  onClick={() => setIsPhysical(false)}
                  className={`relative cursor-pointer flex-1 px-4 py-2 text-center font-chicago text-sm transition-all ${
                    !isPhysical
                      ? "text-oro bg-offNegro"
                      : "text-gris bg-offNegro opacity-50"
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
                  <span className="relative z-10">{dict?.digital}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.quantity} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.preferredMaxPrice} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={preferredMaxPrice}
                  onChange={handlePreferredMaxPriceChange}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                  placeholder="0.000"
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.deadline} * ({dict?.minSevenDays})
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={handleDeadlineChange}
                  min={minDeadline}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.customSpec} *
              </label>
              <FancyBorder className="relative" type="diamond" color="oro">
                <textarea
                  value={customSpec}
                  onChange={(e) => setCustomSpec(e.target.value)}
                  rows={4}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
                  placeholder={dict?.describeRequirement}
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.instructions}
              </label>
              <FancyBorder className="relative" type="diamond" color="oro">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
                  placeholder={dict?.addInstructionsPlaceholder}
                />
              </FancyBorder>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-chicago text-gris">
                  {dict?.customFields}
                </label>
                <div
                  onClick={addCustomField}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">{dict?.addField}</span>
                  </div>
                </div>
              </div>

              {customFields.length === 0 ? (
                <p className="text-xs text-gris font-chicago">
                  {dict?.noCustomFieldsAdded}
                </p>
              ) : (
                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative flex-1"
                      >
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateCustomField(index, "key", e.target.value)
                          }
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-xs focus:outline-none"
                          placeholder={dict?.fieldNamePlaceholder}
                        />
                      </FancyBorder>
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative flex-1"
                      >
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            updateCustomField(index, "value", e.target.value)
                          }
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-xs focus:outline-none"
                          placeholder={dict?.fieldValuePlaceholder}
                        />
                      </FancyBorder>
                      <div
                        onClick={() => removeCustomField(index)}
                        className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
                      >
                        <Image
                          src={"/images/plug.png"}
                          draggable={false}
                          fill
                          objectFit="contain"
                          alt="remove"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <div
                onClick={handleConfirmSelection}
                className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="text-sm text-oro font-chicago relative uppercase flex items-center justify-center px-4 py-2 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{dict?.save}</span>
                </div>
              </div>
              <div
                onClick={
                  editingRequest ? onClose : () => handleSelectChild(null)
                }
                className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="text-sm text-gris font-chicago relative uppercase flex items-center justify-center px-4 py-2 bg-offNegro">
                  <span className="relative z-10">{dict?.cancel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] h-full flex flex-col overflow-hidden">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-awk uppercase text-oro">
              {dict?.selectChild} ({dict?.optional})
            </h2>
            <div
              onClick={handleCancel}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src={"/images/plug.png"}
                draggable={false}
                fill
                objectFit="contain"
                alt="close"
              />
            </div>
          </div>

          <FancyBorder className="relative mb-4" type="circle" color="white">
            <input
              type="text"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={dict?.searchByTitlePlaceholder}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
            />
          </FancyBorder>

          <div
            id="supplyRequestScroll"
            className="flex-1 min-h-0 overflow-y-auto pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <InfiniteScroll
              dataLength={filteredItems.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <p className="text-center text-gris font-chicago text-sm py-4">
                  {dict?.loadingMore}
                </p>
              }
              scrollableTarget="supplyRequestScroll"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item, i) => (
                  <LibraryCard
                    key={i}
                    data={item}
                    dict={dict}
                    onClick={() => handleSelectChild(item)}
                  />
                ))}
              </div>
            </InfiniteScroll>

            {!isLoading && filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gris font-chicago">
                  {dict?.noChildrenFound || "No children found"}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <div
              onClick={() => handleSelectChild(null)}
              className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
            >
              <div className="text-sm text-oro font-chicago relative uppercase flex items-center justify-center px-4 py-2 bg-offNegro">
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
                  {dict?.continueWithoutChild}
                </span>
              </div>
            </div>
            <div
              onClick={handleCancel}
              className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
            >
              <div className="text-sm text-gris font-chicago relative uppercase flex items-center justify-center px-4 py-2 bg-offNegro">
                <span className="relative z-10">{dict?.cancel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
