import { ChildSelectionModalProps } from "../../../types";
import { useChildSelection } from "../../../hooks/infrastructure/children/useChildSelection";
import { useChildSelectionModal } from "../../../hooks/infrastructure/children/useChildSelectionModal";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Child, Template } from "@/components/Item/types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ChildSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  onCancel,
  selectedIds,
  dict,
  editingPlacement,
}: ChildSelectionModalProps) => {
  const {
    selectedType,
    setSelectedType,
    configuring,
    amount,
    handleAmountChange,
    instructions,
    setInstructions,
    customFields,
    handleSelect,
    handleCancel,
    handleConfirmSelection,
    addCustomField,
    updateCustomField,
    removeCustomField,
    getFilteredItems,
    getCounts,
    getItemTitle,
  } = useChildSelectionModal({
    isOpen,
    onClose,
    onSelect,
    onCancel,
    selectedIds,
    dict,
    editingPlacement,
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

  const filteredItems = getFilteredItems(items);
  const { childrenCount, templatesCount } = getCounts(items);

  if (!isOpen) return null;

  if (configuring) {
    const itemTitle = getItemTitle(configuring);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          <div className="relative z-10 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-awk uppercase text-oro">
                  {dict?.configureChildPlacement}
                </h2>
                <p className="text-white text-sm mt-1 font-chicago">
                  {itemTitle}
                </p>
              </div>
              <div
                onClick={editingPlacement ? onClose : () => handleSelect(null)}
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
                {dict?.amount} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={handleAmountChange}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
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

              {customFields.map((field) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <FancyBorder
                    color="white"
                    type="circle"
                    className="relative flex-1"
                  >
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        updateCustomField(field.id, e.target.value, field.value)
                      }
                      placeholder={dict?.fieldNamePlaceholder}
                      className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
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
                        updateCustomField(field.id, field.key, e.target.value)
                      }
                      placeholder={dict?.fieldValuePlaceholder}
                      className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                    />
                  </FancyBorder>
                  <button
                    onClick={() => removeCustomField(field.id)}
                    className="text-fresa hover:text-oro text-sm font-chicago"
                  >
                    {dict?.remove}
                  </button>
                </div>
              ))}

              {customFields.length === 0 && (
                <p className="text-white text-sm font-chicago">
                  {dict?.noCustomFieldsAdded}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <div
                onClick={handleCancel}
                className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{dict?.cancel}</span>
                </div>
              </div>
              <div
                onClick={handleConfirmSelection}
                className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{dict?.addChild}</span>
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
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-awk uppercase text-oro">
              {dict?.selectChildrenForTemplate}
            </h2>
            <div
              onClick={onClose}
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
        </div>

        <div className="relative z-10 px-6 pb-4 flex-shrink-0">
          <div className="flex gap-3 flex-wrap">
            <FancyBorder
              color="white"
              type="circle"
              className="relative flex-1 min-w-[200px]"
            >
              <input
                type="text"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={dict?.searchByTitlePlaceholder}
                className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              />
            </FancyBorder>
            <div className="flex gap-2">
              <div
                onClick={() => setSelectedType("children")}
                className="relative cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span
                    className={`relative z-10 ${
                      selectedType === "children" ? "text-oro" : "text-gris"
                    }`}
                  >
                    {dict?.children} ({childrenCount})
                  </span>
                </div>
              </div>
              <div
                onClick={() => setSelectedType("templates")}
                className="relative cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span
                    className={`relative z-10 ${
                      selectedType === "templates" ? "text-oro" : "text-gris"
                    }`}
                  >
                    {dict?.templates} ({templatesCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 px-6 overflow-hidden mb-6">
          {error && (
            <FancyBorder className="relative mb-4" type="diamond" color="oro">
              <div className="relative z-10 p-4">
                <p className="text-fresa text-sm font-chicago">
                  Error: {error}
                </p>
              </div>
            </FancyBorder>
          )}

          {filteredItems.length > 0 || isLoading ? (
            <InfiniteScroll
              dataLength={filteredItems.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-fit animate-spin h-fit flex">
                    <div className="relative w-6 h-6 flex">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={"/images/scissors.png"}
                        draggable={false}
                        alt="loader"
                      />
                    </div>
                  </div>
                </div>
              }
              height={400}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 pb-4">
                {filteredItems.map((item, index) => {
                  const isTemplate = "templateId" in item;
                  const itemId = isTemplate
                    ? (item as Template).templateId
                    : (item as Child).childId;
                  const itemContract = isTemplate
                    ? (item as Template).templateContract
                    : (item as Child).childContract;

                  return (
                    <LibraryCard
                      dict={dict}
                      data={item}
                      key={`${itemId}-${itemContract}-${index}`}
                      onClick={() => handleSelect(item)}
                    />
                  );
                })}
              </div>
            </InfiniteScroll>
          ) : isLoading && filteredItems.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center py-12">
              <div className="relative w-fit animate-spin h-fit flex">
                <div className="relative w-6 h-6 flex">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={"/images/scissors.png"}
                    draggable={false}
                    alt="loader"
                  />
                </div>
              </div>
            </div>
          ) : (
            <FancyBorder className="relative" type="diamond" color="oro">
              <div className="relative z-10 p-4 text-center">
                <p className="text-white font-chicago text-sm">
                  {searchText
                    ? `${dict?.noItemsFoundMatching} "${searchText}"`
                    : `${dict?.noItemsAvailable} ${selectedType}`}
                </p>
              </div>
            </FancyBorder>
          )}
        </div>
      </div>
    </div>
  );
};
