type NominatimAddress = {
  village?: string;
  town?: string;
  city?: string;
  municipality?: string;
  state?: string;
  region?: string;
  country: string;
  country_code: string;
  "ISO3166-2-lvl4"?: string;
  "ISO3166-2-lvl3"?: string;
};

export type NominatimReverseResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;

  lat: string;
  lon: string;

  class: string;
  type: string;
  place_rank: number;
  importance: number;

  addresstype: string;
  name: string;
  display_name: string;

  address: NominatimAddress;

  boundingbox: string[];
};
