
import SimplePlaceAutocomplete from "@/components/ui/simple-place-autocomplete";
import { PlaceDetails, convertPlaceResultToDetails } from "@/types/places.types";

export default function Index() {
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const placeDetails = convertPlaceResultToDetails(place);
    console.log('Selected place:', placeDetails);
  };

  return (
    <div>
      <SimplePlaceAutocomplete
        onPlaceSelect={handlePlaceSelect}
        placeholder="Search for a place..."
      />
    </div>
  );
}
