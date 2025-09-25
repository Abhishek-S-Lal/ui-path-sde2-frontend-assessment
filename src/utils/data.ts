export type StateType = { id: string; name: string };
export type CityType = { id: string; name: string; stateId: string; pincode: string };
export type PinCodeType = { pincode: string, stateId: string; cityId: string };

export type LocationType = {
  states: StateType[],
  cities: CityType[],
  pincodes: PinCodeType[]
}

export const LOCATION_DATA: LocationType = {
  states: [
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KA', name: 'Karnataka' },
    { id: 'TN', name: 'Tamil Nadu' },
    { id: 'DL', name: 'Delhi' },
    { id: 'UP', name: 'Uttar Pradesh' },
    { id: 'WB', name: 'West Bengal' },
  ],
  cities: [
    { id: 'mumbai', name: 'Mumbai', stateId: 'MH', pincode: '400001' },
    { id: 'pune', name: 'Pune', stateId: 'MH', pincode: '411001' },
    { id: 'nagpur', name: 'Nagpur', stateId: 'MH', pincode: '440001' },
    { id: 'bangalore', name: 'Bangalore', stateId: 'KA', pincode: '560001' },
    { id: 'mysore', name: 'Mysore', stateId: 'KA', pincode: '570001' },
    { id: 'chennai', name: 'Chennai', stateId: 'TN', pincode: '600001' },
    { id: 'coimbatore', name: 'Coimbatore', stateId: 'TN', pincode: '641001' },
    { id: 'delhi', name: 'New Delhi', stateId: 'DL', pincode: '110001' },
    { id: 'gurgaon', name: 'Gurgaon', stateId: 'DL', pincode: '122001' },
    { id: 'lucknow', name: 'Lucknow', stateId: 'UP', pincode: '226001' },
    { id: 'kolkata', name: 'Kolkata', stateId: 'WB', pincode: '700001' },
  ],
  pincodes: [
    { pincode: '400001', cityId: 'mumbai', stateId: 'MH' },
    { pincode: '411001', cityId: 'pune', stateId: 'MH' },
    { pincode: '440001', cityId: 'nagpur', stateId: 'MH' },
    { pincode: '560001', cityId: 'bangalore', stateId: 'KA' },
    { pincode: '570001', cityId: 'mysore', stateId: 'KA' },
    { pincode: '600001', cityId: 'chennai', stateId: 'TN' },
    { pincode: '641001', cityId: 'coimbatore', stateId: 'TN' },
    { pincode: '110001', cityId: 'delhi', stateId: 'DL' },
    { pincode: '122001', cityId: 'gurgaon', stateId: 'DL' },
    { pincode: '226001', cityId: 'lucknow', stateId: 'UP' },
    { pincode: '700001', cityId: 'kolkata', stateId: 'WB' },
  ]
};