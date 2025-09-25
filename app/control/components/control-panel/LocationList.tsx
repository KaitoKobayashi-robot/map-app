import type { Location } from "@/types/location";
import LocationItem from "./LocationItem";

interface LocationListProps {
  locations: Location[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
}

const LocationList = ({
  locations,
  selectedIds,
  onToggleSelection,
}: LocationListProps) => (
  <div className="space-y-2 mb-6">
    {locations.map(loc => (
      <LocationItem
        key={loc.id}
        location={loc}
        isSelected={selectedIds.includes(loc.id)}
        onToggle={onToggleSelection}
      />
    ))}
  </div>
);

export default LocationList;
