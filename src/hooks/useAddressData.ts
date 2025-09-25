import { useCallback, useMemo } from "react";
import { LOCATION_DATA, type CityType, type PinCodeType, type StateType } from "../utils/data";

type AddressData = {
  states: StateType[];
  getLocationByPincode: (pincode: string) => PinCodeType | null;
  getCitiesByState: (stateId: string) => CityType[];
  getStateById: (stateId: string) => StateType | undefined;
  getCityById: (cityId: string) => CityType | undefined;
};

type FnAddressData = () => AddressData;

// Custom hook for address data operations
export const useAddressData: FnAddressData = () => {
  // Memoized lookup maps for O(1) operations
  const lookupMaps = useMemo(() => {
    const stateById = new Map(LOCATION_DATA.states.map(state => [state.id, state]));
    const cityById = new Map(LOCATION_DATA.cities.map(city => [city.id, city]));
    
    const citiesByState = LOCATION_DATA.cities.reduce<Record<string, CityType[]>>((acc, city) => {
      if (!acc[city.stateId]) acc[city.stateId] = [];
      acc[city.stateId].push(city);
      return acc;
    }, {});
    
    const locationByPincode = new Map(LOCATION_DATA.pincodes.map(p => [p.pincode.slice(0,3), p]));
    
    return {
      stateById,
      cityById,
      citiesByState,
      locationByPincode
    };
  }, []);

  const getLocationByPincode = useCallback((pincode: string) => {
    return lookupMaps.locationByPincode.get(pincode.slice(0,3)) ?? null;
  }, [lookupMaps.locationByPincode]);

  const getCitiesByState = useCallback((stateId: string) => {
    return lookupMaps.citiesByState[stateId] || [];
  }, [lookupMaps.citiesByState]);

  const getStateById = useCallback((stateId: string) => {
    return lookupMaps.stateById.get(stateId);
  }, [lookupMaps.stateById]);

  const getCityById = useCallback((cityId: string) => {
    return lookupMaps.cityById.get(cityId);
  }, [lookupMaps.cityById]);

  return {
    states: LOCATION_DATA.states,
    getLocationByPincode,
    getCitiesByState,
    getStateById,
    getCityById
  };
};