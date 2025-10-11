"use client";

import { useState } from "react";
import { AdvancedFiltersProps, LibraryFilters } from "../types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const AdvancedFilters = ({
  filters,
  onFiltersChange,
  dict,
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOrderByOpen, setIsOrderByOpen] = useState(false);
  const [isOrderDirectionOpen, setIsOrderDirectionOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

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

  const orderByOptions = [
    { value: "blockTimestamp", label: dict?.createdDate },
    { value: "digitalPrice", label: dict?.digitalPrice },
    { value: "physicalPrice", label: dict?.physicalPrice },
    { value: "availability", label: dict?.availability },
  ];

  const orderDirectionOptions = [
    { value: "desc", label: dict?.newestFirst },
    { value: "asc", label: dict?.oldestFirst },
  ];

  const availabilityOptions = [
    { value: "", label: dict?.allAvailability },
    { value: "0", label: dict?.digitalOnly },
    { value: "1", label: dict?.physicalOnly },
    { value: "2", label: dict?.digitalPhysicalBoth },
  ];

  return (
    <FancyBorder
      type="diamond"
      className="relative font-chicago justify-center items-center w-full flex text-gris"
    >
      <div className="relative z-10 w-full flex flex-col p-4">
        <div
          className={`flex items-center justify-between ${
            isExpanded && "mb-4"
          }`}
        >
          <h3 className="text-2xl uppercase">{dict?.advancedFilters}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-xs lowercase hover:underline"
            >
              {dict?.clearAll}
            </button>
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm relative z-10 lowercase cursor-pointer flex px-3 py-1"
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
              {isExpanded ? dict?.collapse : dict?.expand}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">{dict?.orderBy}</label>
              <FancyBorder type="circle" color="white" className="relative">
                <div
                  onClick={() => {
                    setIsOrderByOpen(!isOrderByOpen);
                    setIsOrderDirectionOpen(false);
                    setIsAvailabilityOpen(false);
                  }}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {
                      orderByOptions.find(
                        (opt) => opt.value === filters.orderBy
                      )?.label
                    }
                  </span>
                  <div className="relative w-3 h-3 rotate-90">
                    <Image
                      src={"/images/arrow.png"}
                      draggable={false}
                      fill
                      alt="arrow"
                    />
                  </div>
                </div>
                {isOrderByOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-black border border-white">
                    {orderByOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          handleFilterChange("orderBy", option.value);
                          setIsOrderByOpen(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm mb-2">
                {dict?.orderDirection}
              </label>
              <FancyBorder type="circle" color="white" className="relative">
                <div
                  onClick={() => {
                    setIsOrderDirectionOpen(!isOrderDirectionOpen);
                    setIsOrderByOpen(false);
                    setIsAvailabilityOpen(false);
                  }}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {
                      orderDirectionOptions.find(
                        (opt) => opt.value === filters.orderDirection
                      )?.label
                    }
                  </span>
                  <div className="relative w-3 h-3 rotate-90">
                    <Image
                      src={"/images/arrow.png"}
                      draggable={false}
                      fill
                      alt="arrow"
                    />
                  </div>
                </div>
                {isOrderDirectionOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-black border border-white">
                    {orderDirectionOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          handleFilterChange("orderDirection", option.value);
                          setIsOrderDirectionOpen(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm mb-2">{dict?.availability}</label>
              <FancyBorder type="circle" color="white" className="relative">
                <div
                  onClick={() => {
                    setIsAvailabilityOpen(!isAvailabilityOpen);
                    setIsOrderByOpen(false);
                    setIsOrderDirectionOpen(false);
                  }}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {
                      availabilityOptions.find(
                        (opt) =>
                          opt.value === (filters.availability?.toString() || "")
                      )?.label
                    }
                  </span>
                  <div className="relative w-3 h-3 rotate-90">
                    <Image
                      src={"/images/arrow.png"}
                      draggable={false}
                      fill
                      alt="arrow"
                    />
                  </div>
                </div>
                {isAvailabilityOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-black border border-white">
                    {availabilityOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          handleFilterChange(
                            "availability",
                            option.value ? parseInt(option.value) : null
                          );
                          setIsAvailabilityOpen(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm mb-2">
                {dict?.supplierAddress}
              </label>
              <FancyBorder type="circle" color="white" className="relative">
                <input
                  type="text"
                  value={filters.supplierAddress}
                  onChange={(e) =>
                    handleFilterChange("supplierAddress", e.target.value)
                  }
                  placeholder={dict?.enterSupplierAddress}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm mb-2">{dict?.scm}</label>
              <FancyBorder type="circle" color="white" className="relative">
                <input
                  type="text"
                  value={filters.scm}
                  onChange={(e) => handleFilterChange("scm", e.target.value)}
                  placeholder={dict?.enterScm}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                />
              </FancyBorder>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm mb-2">
                {dict?.digitalPriceRange}
              </label>
              <div className="flex gap-2">
                <FancyBorder
                  type="circle"
                  color="white"
                  className="relative flex-1"
                >
                  <input
                    type="number"
                    value={filters.minDigitalPrice}
                    onChange={(e) =>
                      handleFilterChange("minDigitalPrice", e.target.value)
                    }
                    placeholder={dict?.min}
                    step="0.001"
                    className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                  />
                </FancyBorder>
                <FancyBorder
                  type="circle"
                  color="white"
                  className="relative flex-1"
                >
                  <input
                    type="number"
                    value={filters.maxDigitalPrice}
                    onChange={(e) =>
                      handleFilterChange("maxDigitalPrice", e.target.value)
                    }
                    placeholder={dict?.max}
                    step="0.001"
                    className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                  />
                </FancyBorder>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm mb-2">
                {dict?.physicalPriceRange}
              </label>
              <div className="flex gap-2">
                <FancyBorder
                  type="circle"
                  color="white"
                  className="relative flex-1"
                >
                  <input
                    type="number"
                    value={filters.minPhysicalPrice}
                    onChange={(e) =>
                      handleFilterChange("minPhysicalPrice", e.target.value)
                    }
                    placeholder={dict?.min}
                    step="0.001"
                    className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                  />
                </FancyBorder>
                <FancyBorder
                  type="circle"
                  color="white"
                  className="relative flex-1"
                >
                  <input
                    type="number"
                    value={filters.maxPhysicalPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPhysicalPrice", e.target.value)
                    }
                    placeholder={dict?.max}
                    step="0.001"
                    className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none"
                  />
                </FancyBorder>
              </div>
            </div>
          </div>
        )}
      </div>
    </FancyBorder>
  );
};
