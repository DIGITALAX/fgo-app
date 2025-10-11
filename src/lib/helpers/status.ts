export const getStatusLabel = (status: string, dict: any): string => {
  if (!dict) {
    switch (Number(status)) {
      case 0:
        return "Reserved";
      case 1:
        return "Supply Pending";
      case 2:
        return "Active";
      case 3:
        return "Disabled";
      default:
        return "Unknown";
    }
  }

  switch (Number(status)) {
    case 0:
      return dict?.reserved;
    case 1:
      return dict?.supply;
    case 2:
      return dict?.active;
    case 3:
      return dict?.disabled;
    default:
      return dict?.unknown;
  }
};
