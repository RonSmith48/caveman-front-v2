import * as Yup from 'yup';
import { requiredFieldsByStatus } from './cardConfig';

// flatten all possible fields so we can declare them up‐front
const allFields = Array.from(new Set(Object.values(requiredFieldsByStatus).flat()));

const baseShape = {
  status: Yup.string().oneOf(Object.keys(requiredFieldsByStatus), 'Invalid status').required('Status is required')
};

// for each field, build a .when that looks up the current status
allFields.forEach((fieldName) => {
  baseShape[fieldName] = Yup.mixed().when('status', {
    is: (status) => (requiredFieldsByStatus[status] || []).includes(fieldName),
    then: (schema) =>
      // choose a more specific schema if you like:
      fieldName.includes('date') ? Yup.date().required('This date is required') : Yup.string().required('This field is required'),
    otherwise: (schema) => schema.notRequired()
  });
});

export default Yup.object().shape(baseShape);
