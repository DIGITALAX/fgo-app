export const getAvailabilityLabel = (
  availability: number | string,
  dict: any
): string => {
  const availabilityNum =
    typeof availability === "string" ? parseInt(availability) : availability;

  if (!dict) {
    switch (availabilityNum) {
      case 0:
        return "Digital Only";
      case 1:
        return "Physical Only";
      case 2:
        return "Digital + Physical";
      default:
        return "Available";
    }
  }

  switch (availabilityNum) {
    case 0:
      return dict?.digitalOnly;
    case 1:
      return dict?.physicalOnly;
    case 2:
      return dict?.digitalPhysical;
    default:
      return dict?.available;
  }
};

export const parseAvailability = (availability: any, dict: any): number => {
  if (typeof availability === "string") {
    if (availability === "Digital Only" || availability == dict?.digitalOnly)
      return 0;
    if (availability === "Physical Only" || availability == dict?.physicalOnly)
      return 1;
    if (
      availability === "Both" ||
      availability == "Digital + Physical" ||
      availability == dict?.digitalPhysical
    )
      return 2;
    return parseInt(availability) || 0;
  }
  return availability || 0;
};

export const getOrderLabel = (
  orderStatus: number | string,
  dict: any
): string => {
  const availabilityNum =
    typeof orderStatus === "string" ? parseInt(orderStatus) : orderStatus;

  if (!dict) {
    switch (availabilityNum) {
      case 0:
        return "Paid";
      case 1:
        return "Cancelled";
      case 2:
        return "Refunded";
      default:
        return "Disputed";
    }
  }

  switch (availabilityNum) {
    case 0:
      return dict?.paid;
    case 1:
      return dict?.cancelled;
    case 2:
      return dict?.refunded;
    default:
      return dict?.disputed;
  }
};
