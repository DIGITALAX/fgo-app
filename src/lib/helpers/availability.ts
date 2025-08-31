export const getAvailabilityLabel = (availability: number | string): string => {
  const availabilityNum =
    typeof availability === "string" ? parseInt(availability) : availability;

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
};

export const parseAvailability = (availability: any): number => {
  if (typeof availability === "string") {
    if (availability === "Digital Only") return 0;
    if (availability === "Physical Only") return 1;
    if (availability === "Both") return 2;
    return parseInt(availability) || 0;
  }
  return availability || 0;
};
