
import { onRequest } from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {Client} from "@googlemaps/google-maps-services-js";

// Initialize the Google Maps client
const client = new Client({});

// Environment variables
const GOOGLE_MAPS_API_KEY = defineString("GOOGLE_MAPS_API_KEY");

/**
 * Get place predictions from Google Places API
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 */
export const getPlacePredictions = onRequest(async (request, response) => {
  try {
    const {input, types} = request.body.data;

    const result = await client.placeAutocomplete({
      params: {
        input,
        types: types || [],
        key: GOOGLE_MAPS_API_KEY.value(),
      },
    });

    response.json({
      predictions: result.data.predictions.map((prediction) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        structured_formatting: {
          main_text: prediction.structured_formatting?.main_text,
          secondary_text: prediction.structured_formatting?.secondary_text,
        },
      })),
    });
  } catch (error) {
    console.error("Error in getPlacePredictions:", error);
    response.status(500).json({error: "Failed to get place predictions"});
  }
});

/**
 * Get place details from Google Places API
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 */
export const getPlaceDetails = onRequest(async (request, response) => {
  try {
    const {placeId} = request.body.data;

    const result = await client.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY.value(),
      },
    });

    const place = result.data.result;
    response.json({
      place_details: {
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        types: place.types,
        location: place.geometry?.location
          ? {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error in getPlaceDetails:", error);
    response.status(500).json({error: "Failed to get place details"});
  }
});
