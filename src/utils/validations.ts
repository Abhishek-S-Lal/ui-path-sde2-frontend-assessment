// Form validation utilities
export const ValidationUtils = {
  validateName: (name: string) => {
    if (!name.trim()) return 'This field is required';
    if (name.length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Only letters and spaces allowed';
    return null;
  },

  validatePincode: (pincode: string) => {
    if (!pincode.trim()) return 'Pincode is required';
    if (!/^\d{6}$/.test(pincode)) return 'Must be 6 digits';
    return null;
  },

  validateRequired: (value: string, fieldName: string) => {
    return !value ? `${fieldName} is required` : null;
  }
};
