// File: validationSchema.js
import * as Yup from 'yup';
import { statuses } from './cardConfig';

const validationSchema = Yup.object().shape({
  status: Yup.string().oneOf(statuses, 'Invalid status').required('Status is required'),

  // Only require chargingDate when status === 'Charged'
  chargingDate: Yup.date().when('status', {
    is: 'Charged',
    then: (schema) => schema.required('Charge date is required'),
    otherwise: (schema) => schema.notRequired()
  }),

  // Only require boggedTonnes when status === 'Bogging'
  boggedTonnes: Yup.number().when('status', {
    is: 'Bogging',
    then: (schema) => schema.typeError('Tonnes must be a number').required('Bogged tonnes are required'),
    otherwise: (schema) => schema.notRequired()
  })

  // ... add other conditional fields as needed ...
});

export default validationSchema;
