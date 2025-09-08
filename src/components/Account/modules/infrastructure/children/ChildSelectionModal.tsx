import { ChildSelectionModalProps } from "../../../types";
import { useChildSelection } from "../../../hooks/infrastructure/children/useChildSelection";
import { useChildSelectionModal } from "../../../hooks/infrastructure/children/useChildSelectionModal";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Child, Template } from "@/components/Item/types";

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black rounded-sm border border-white w-full max-w-2xl overflow-hidden">
          <div className="p-4 border-b border-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-herm text-white">
                {dict?.configureChildPlacement}
              </h2>
              <button
                onClick={editingPlacement ? onClose : () => handleSelect(null)}
                className="text-white hover:text-ama transition-colors font-herm"
              >
                ✕
              </button>
            </div>
            <p className="text-ama text-sm mt-1 font-herm">{itemTitle}</p>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.amount} *
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.instructions}
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none font-herm"
                placeholder={dict?.addInstructionsPlaceholder}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-herm text-ama">
                  {dict?.customFields}
                </label>
                <button
                  onClick={addCustomField}
                  className="text-mar hover:text-ama text-sm font-herm"
                >
                  {dict?.addField}
                </button>
              </div>

              {customFields.map((field) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) =>
                      updateCustomField(field.id, e.target.value, field.value)
                    }
                    placeholder={dict?.fieldNamePlaceholder}
                    className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      updateCustomField(field.id, field.key, e.target.value)
                    }
                    placeholder={dict?.fieldValuePlaceholder}
                    className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                  />
                  <button
                    onClick={() => removeCustomField(field.id)}
                    className="px-3 py-2 text-fresa hover:text-ama text-sm font-herm"
                  >
                    {dict?.remove}
                  </button>
                </div>
              ))}

              {customFields.length === 0 && (
                <p className="text-ama text-sm font-herm">
                  {dict?.noCustomFieldsAdded}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-white flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors"
            >
              {dict?.cancel}
            </button>
            <button
              onClick={handleConfirmSelection}
              className="flex-1 px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors"
            >
              {dict?.addChild}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white w-full max-w-6xl max-h-full overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-herm text-white">
              {dict?.selectChildrenForTemplate}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-ama transition-colors font-herm"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-white flex-shrink-0">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={dict?.searchByTitlePlaceholder}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
              />
            </div>
            <div className="flex bg-black rounded-sm border border-white">
              <button
                onClick={() => setSelectedType("children")}
                className={`px-3 py-2 text-sm font-herm rounded-l-sm transition-colors ${
                  selectedType === "children"
                    ? "bg-ama text-black"
                    : "text-white hover:text-ama"
                }`}
              >
                {dict?.children} ({childrenCount})
              </button>
              <button
                onClick={() => setSelectedType("templates")}
                className={`px-3 py-2 text-sm font-herm rounded-r-sm transition-colors ${
                  selectedType === "templates"
                    ? "bg-ama text-black"
                    : "text-white hover:text-ama"
                }`}
              >
                {dict?.templates} ({templatesCount})
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          {error && (
            <div className="bg-black border border-fresa rounded-sm p-4 mb-4">
              <p className="text-fresa text-sm font-herm">Error: {error}</p>
            </div>
          )}

          {filteredItems.length > 0 || isLoading ? (
            <InfiniteScroll
              dataLength={filteredItems.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="text-center py-4 text-white/60 font-herm text-sm">
                  {dict?.loadingMore} {selectedType}...
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
            <div className="bg-black rounded-sm p-4 border border-white flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-herm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
                <span>{dict?.loading} {selectedType}...</span>
              </div>
            </div>
          ) : (
            <div className="bg-black rounded-sm p-4 border border-white">
              <p className="text-ama text-center font-herm text-sm">
                {searchText
                  ? `${dict?.noItemsFoundMatching} "${searchText}"`
                  : `${dict?.noItemsAvailable} ${selectedType}`}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors"
          >
            {dict?.close}
          </button>
        </div>
      </div>
    </div>
  );
};
