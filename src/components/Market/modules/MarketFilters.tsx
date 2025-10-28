"use client";

import { useState } from "react";
import { MarketFiltersProps, MarketFilterState } from "../types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const MarketFilters = ({
  filters,
  onFiltersChange,
  dict,
}: MarketFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);
  const [isOrderByOpen, setIsOrderByOpen] = useState<boolean>(false);
  const [isOrderDirectionOpen, setIsOrderDirectionOpen] = useState<boolean>(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState<boolean>(false);

  const handleFilterChange = (key: keyof MarketFilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchText: "",
      itemType: "all",
      availability: "all",
      orderBy: "createdDate",
      orderDirection: "desc",
    });
  };

  const typeOptions = [
    { value: "all", label: dict?.allTypes },
    { value: "supplyRequests", label: dict?.supplyRequests },
    { value: "futures", label: dict?.futures },
    { value: "children", label: dict?.children },
    { value: "templates", label: dict?.templates },
    { value: "parents", label: dict?.parents },
    { value: "markets", label: dict?.listedInMarkets },
  ];

  const orderByOptions = [
    { value: "createdDate", label: dict?.createdDate },
    { value: "futuresDeadline", label: dict?.futuresDeadline },
    { value: "supplyRequestDeadline", label: dict?.supplyRequestDeadline },
  ];

  const orderDirectionOptions = [
    { value: "desc", label: dict?.newestFirst },
    { value: "asc", label: dict?.oldestFirst },
  ];

  const availabilityOptions = [
    { value: "all", label: dict?.allAvailability },
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
              <label className="block text-sm mb-2">{dict?.filterByType}</label>
              <FancyBorder type="circle" color="white" className="relative">
                <div
                  onClick={() => {
                    setIsTypeOpen(!isTypeOpen);
                    setIsOrderByOpen(false);
                    setIsOrderDirectionOpen(false);
                    setIsAvailabilityOpen(false);
                  }}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {
                      typeOptions.find((opt) => opt.value === filters.itemType)
                        ?.label
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
                {isTypeOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-black border border-white">
                    {typeOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          handleFilterChange("itemType", option.value);
                          setIsTypeOpen(false);
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
              <label className="block text-sm mb-2">{dict?.orderBy}</label>
              <FancyBorder type="circle" color="white" className="relative">
                <div
                  onClick={() => {
                    setIsOrderByOpen(!isOrderByOpen);
                    setIsTypeOpen(false);
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
                    setIsTypeOpen(false);
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
                    setIsTypeOpen(false);
                    setIsOrderByOpen(false);
                    setIsOrderDirectionOpen(false);
                  }}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
                >
                  <span>
                    {
                      availabilityOptions.find(
                        (opt) => opt.value === filters.availability
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
                          handleFilterChange("availability", option.value);
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
          </div>
        )}
      </div>
    </FancyBorder>
  );
};
