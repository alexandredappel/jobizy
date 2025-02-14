
import { SimplePlaceAutocomplete } from "@/components/ui/simple-place-autocomplete";
import { PlaceDetails } from "@/types/places.types";

export default function Index() {
  const handlePlaceSelect = (place: PlaceDetails) => {
    console.log('Selected place:', place);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Autocomplete</h1>
      <div className="max-w-md">
        <SimplePlaceAutocomplete
          onPlaceSelect={handlePlaceSelect}
          placeholder="Enter an establishment name..."
        />
      </div>
    </div>
  );
}
