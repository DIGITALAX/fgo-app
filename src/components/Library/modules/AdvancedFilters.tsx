"use client";

import { useState } from "react";
import { AdvancedFiltersProps, LibraryFilters } from "../types";

export const AdvancedFilters = ({
  filters,
  onFiltersChange,
  dict,
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof LibraryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchText: "",
      orderBy: "blockTimestamp",
      orderDirection: "desc",
      supplierAddress: "",
      availability: null,
      scm: "",
      minDigitalPrice: "",
      maxDigitalPrice: "",
      minPhysicalPrice: "",
      maxPhysicalPrice: "",
    });
  };

  return (
    <div className="bg-black border border-white rounded-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-herm text-lg">
          {dict?.advancedFilters}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="text-xs text-white/60 hover:text-white font-herm underline"
          >
            {dict?.clearAll}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white font-herm text-sm px-3 py-1 border border-white rounded-sm hover:bg-white/10"
          >
            {isExpanded ? dict?.collapse : dict?.expand}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.orderBy}
            </label>
            <select
              value={filters.orderBy}
              onChange={(e) => handleFilterChange("orderBy", e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama"
            >
              <option value="blockTimestamp">{dict?.createdDate}</option>
              <option value="digitalPrice">{dict?.digitalPrice}</option>
              <option value="physicalPrice">{dict?.physicalPrice}</option>
              <option value="availability">{dict?.availability}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.orderDirection}
            </label>
            <select
              value={filters.orderDirection}
              onChange={(e) =>
                handleFilterChange("orderDirection", e.target.value)
              }
              className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama"
            >
              <option value="desc">{dict?.newestFirst}</option>
              <option value="asc">{dict?.oldestFirst}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.availability}
            </label>
            <select
              value={filters.availability || ""}
              onChange={(e) =>
                handleFilterChange(
                  "availability",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama"
            >
              <option value="">{dict?.allAvailability}</option>
              <option value="0">{dict?.digitalOnly}</option>
              <option value="1">{dict?.physicalOnly}</option>
              <option value="2">{dict?.digitalPhysicalBoth}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.supplierAddress}
            </label>
            <input
              type="text"
              value={filters.supplierAddress}
              onChange={(e) =>
                handleFilterChange("supplierAddress", e.target.value)
              }
              placeholder={dict?.enterSupplierAddress}
              className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.scm}
            </label>
            <input
              type="text"
              value={filters.scm}
              onChange={(e) => handleFilterChange("scm", e.target.value)}
              placeholder={dict?.enterScm}
              className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.digitalPriceRange}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minDigitalPrice}
                onChange={(e) =>
                  handleFilterChange("minDigitalPrice", e.target.value)
                }
                placeholder={dict?.min}
                step="0.001"
                className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
              />
              <input
                type="number"
                value={filters.maxDigitalPrice}
                onChange={(e) =>
                  handleFilterChange("maxDigitalPrice", e.target.value)
                }
                placeholder={dict?.max}
                step="0.001"
                className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-herm text-ama mb-2">
              {dict?.physicalPriceRange}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPhysicalPrice}
                onChange={(e) =>
                  handleFilterChange("minPhysicalPrice", e.target.value)
                }
                placeholder={dict?.min}
                step="0.001"
                className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
              />
              <input
                type="number"
                value={filters.maxPhysicalPrice}
                onChange={(e) =>
                  handleFilterChange("maxPhysicalPrice", e.target.value)
                }
                placeholder={dict?.max}
                step="0.001"
                className="flex-1 px-3 py-2 bg-black border border-white rounded-sm text-white text-sm font-herm focus:outline-none focus:border-ama placeholder:text-white/40"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
