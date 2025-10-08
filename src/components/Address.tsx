import { useMemo, useRef, useState } from "react";
import { useAddressData } from "../hooks/useAddressData";
import type { CityType } from "../utils/data";
import { ValidationUtils } from "../utils/validations";
import "./Address.css";

// --- Type Definitions ---
type FormData = {
  firstName: string;
  lastName: string;
  pincode: string;
  state: string;
  city: string;
};

type Errors = {
  firstName?: string | null;
  lastName?: string | null;
  pincode?: string | null;
  state?: string | null;
  city?: string | null;
};

type Touched = {
  firstName?: boolean;
  lastName?: boolean;
  pincode?: boolean;
  state?: boolean;
  city?: boolean;
};


const AddressForm = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    pincode: '',
    state: '',
    city: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  
  // Refs for managing focus
  const cityRef = useRef<HTMLSelectElement>(null);

  const { states, getLocationByPincode, getCitiesByState, getStateById, getCityById } = useAddressData();

  // Memoized filtered cities based on selected state
  const filteredCities = useMemo<CityType[]>(() => {
    return formData.state ? getCitiesByState(formData.state) : [];
  }, [formData.state, getCitiesByState]);

  // Generic field update handler
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Auto-fill logic for pincode changes
  const handlePincodeChange = (pincode: string) => {
    updateField('pincode', pincode);

    if (pincode.length === 6) {
      const location = getLocationByPincode(pincode);
      if (location) {
        setFormData(prev => ({
          ...prev,
          pincode,
          state: location.stateId,
          city: location.cityId
        }));
        
        // Clear related errors
        setErrors(prev => ({
          ...prev,
          pincode: null,
          state: null,
          city: null
        }));
      } else {
        setErrors(prev => ({ ...prev, pincode: 'Invalid pincode' }));
      }
    }
  };

  // Auto-fill logic for state changes
  const handleStateChange = (stateId: string) => {
    updateField('state', stateId);
    
    // Reset city when state changes
    if (formData.city) {
      const currentCity = getCityById(formData.city);
      if (!currentCity || currentCity.stateId !== stateId) {
        updateField('city', '');
        
        // Focus city dropdown after state selection
        setTimeout(() => cityRef.current?.focus(), 0);
      }
    }
  };

  // Auto-fill logic for city changes
  const handleCityChange = (cityId: string) => {
    updateField('city', cityId);

    if (cityId) {
      const city = getCityById(cityId);
      if (city) {
        setFormData(prev => ({
          ...prev,
          city: cityId,
          state: city.stateId,
          pincode: city.pincode
        }));
        
        // Clear related errors
        setErrors(prev => ({
          ...prev,
          city: null,
          state: null,
          pincode: null
        }));
      }
    }
  };

  // Field blur handler for validation
  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error: string | null = null;
    switch (field) {
      case 'firstName':
      case 'lastName':
        error = ValidationUtils.validateName(formData[field]);
        break;
      case 'pincode':
        error = ValidationUtils.validatePincode(formData[field]);
        break;
      case 'state':
        error = ValidationUtils.validateRequired(formData[field], 'State');
        break;
      case 'city':
        error = ValidationUtils.validateRequired(formData[field], 'City');
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Form submission handler
  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Errors = {
      firstName: ValidationUtils.validateName(formData.firstName),
      lastName: ValidationUtils.validateName(formData.lastName),
      pincode: ValidationUtils.validatePincode(formData.pincode),
      state: ValidationUtils.validateRequired(formData.state, 'State'),
      city: ValidationUtils.validateRequired(formData.city, 'City')
    };

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      pincode: true,
      state: true,
      city: true
    });

    // Check if form is valid
    const isValid = !Object.values(newErrors).some(error => error !== null);
    
    if (isValid) {
      const state = getStateById(formData.state);
      const city = getCityById(formData.city);
      
      console.log('Form submitted successfully:', {
        ...formData,
        stateName: state?.name,
        cityName: city?.name
      });
      alert('Address saved successfully!');
    }
  };

  return (
    <div className="address-form">
      <h2>Address Information</h2>
      
      <div className="address-form-grid">
        {/* Name Fields Row */}
        <div className="name-row">
          <div className={`form-field ${errors.firstName && touched.firstName ? 'has-error' : ''}`}>
            <label htmlFor='firstname'>First Name *</label>
            <input
              id="firstname"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Enter first name"
            />
            {errors.firstName && touched.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>

          <div className={`form-field ${errors.lastName && touched.lastName ? 'has-error' : ''}`}>
            <label htmlFor='lastname'>Last Name *</label>
            <input
              id='lastname'
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Enter last name"
            />
            {errors.lastName && touched.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Pincode Field */}
        <div className={`form-field ${errors.pincode && touched.pincode ? 'has-error' : ''}`}>
          <label htmlFor="pincode">Pincode *</label>
          <input
            id="pincode"
            type="text"
            value={formData.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            onBlur={() => handleBlur('pincode')}
            maxLength={6}
            placeholder="Enter 6-digit pincode"
          />
          {errors.pincode && touched.pincode && (
            <span className="error">{errors.pincode}</span>
          )}
        </div>

        {/* State and City Row */}
        <div className="location-row">
          <div className={`form-field ${errors.state && touched.state ? 'has-error' : ''}`}>
            <label htmlFor="state">State *</label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              onBlur={() => handleBlur('state')}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && touched.state && (
              <span className="error">{errors.state}</span>
            )}
          </div>

          <div className={`form-field ${errors.city && touched.city ? 'has-error' : ''}`}>
            <label htmlFor="city">City *</label>
            <select
              id="city"
              ref={cityRef}
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              onBlur={() => handleBlur('city')}
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {filteredCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && touched.city && (
              <span className="error">{errors.city}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-button" onClick={handleSubmit}>
          Save Address
        </div>
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <strong>Current Form State:</strong>
        <pre>
          {JSON.stringify(formData, null, 4)}
        </pre>
      </div>
    </div>
  );
};

export default AddressForm;