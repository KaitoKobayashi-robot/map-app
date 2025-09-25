import type { Location } from "@/types/location";

interface LocationItemProps {
  location: Location;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const LocationItem = ({
  location,
  isSelected,
  onToggle,
}: LocationItemProps) => (
  <button
    onClick={() => onToggle(location.id)}
    className={`w-full text-left p-3 rounded-lg transition-colors ${
      isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    {location.name}
  </button>
);

export default LocationItem;
