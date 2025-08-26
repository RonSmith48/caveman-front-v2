// validationSchema.js
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { requiredFieldsByStatus } from './cardConfig';

// Identify date-like fields (works for your split fields like *_date, design_date, etc.)
const isDateField = (name) => name.toLowerCase().includes('date');

// A base validator that accepts dayjs, Date, or ISO string, and flags invalid inputs.
// If the field is optional, empty values pass; if required, we add .required() later.
const dateBase = Yup.mixed()
  .transform((value, originalValue) => {
    // Accept dayjs objects directly
    if (dayjs.isDayjs(originalValue)) return originalValue.toDate();
    return originalValue;
  })
  .test('valid-date', 'Invalid date', (v) => {
    if (v === undefined || v === null || v === '') return true; // empties are handled by .required when needed
    const d = v instanceof Date ? v : new Date(v);
    return !isNaN(d.getTime());
  });

// Flatten all possibly-required fields so we can declare them up-front
const allFields = Array.from(new Set(Object.values(requiredFieldsByStatus).flat()));

const baseShape = {
  status: Yup.string().oneOf(Object.keys(requiredFieldsByStatus), 'Invalid status').required('Status is required')
};

// For each field, toggle requiredness based on current status
allFields.forEach((fieldName) => {
  baseShape[fieldName] = Yup.mixed().when('status', {
    is: (status) => (requiredFieldsByStatus[status] || []).includes(fieldName),
    then: () => {
      // REQUIRED by status
      if (isDateField(fieldName)) {
        return dateBase.required('This date is required');
      }
      return Yup.string().required('This field is required');
    },
    otherwise: () => {
      // NOT required by status
      if (isDateField(fieldName)) {
        // Optional, but if user enters something, it must be a valid date
        return dateBase.notRequired();
      }
      return Yup.mixed().notRequired();
    }
  });
});

export default Yup.object().shape(baseShape);
