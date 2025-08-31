
export const getStatusLabel = (status: string): string => {
  switch (Number(status)) {
    case 0:
      return "Reserved";
    case 1:
      return "Active";
    case 2:
      return "Disabled";
    default:
      return "Unknown";
  }
};
