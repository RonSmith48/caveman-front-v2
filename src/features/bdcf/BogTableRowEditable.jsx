'use client';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

// material-ui
import TextField from '@mui/material/TextField';

// third-party
import * as yup from 'yup';
import { Formik, Form } from 'formik';

// ==============================|| EDITABLE ROW ||============================== //

export default function RowEditable({ getValue: initialValue, row, column: { id, columnDef }, table }) {
  const [value, setValue] = useState(initialValue);
  const tableMeta = table.options.meta;

  const onChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Update table data immediately when value changes
    tableMeta.updateData(row.index, id, newValue);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Validation schema for the "tonnes" column
  const userInfoSchema = yup.object().shape({
    userInfo: yup.number().typeError('Tonnes must be a number').required('Required')
  });

  const isEditable = tableMeta?.selectedRow[row.id]; // Check if the row is editable

  let element;
  if (id === 'tonnes') {
    element = (
      <>
        {isEditable ? (
          <Formik
            initialValues={{
              userInfo: value
            }}
            enableReinitialize
            validationSchema={userInfoSchema}
            onSubmit={() => {}}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <TextField
                  value={values.userInfo}
                  id={`${row.index}-${id}`}
                  name="userInfo"
                  onChange={(e) => {
                    handleChange(e); // Formik's internal change handler
                    onChange(e); // Update table data on change
                  }}
                  onBlur={handleBlur}
                  error={touched.userInfo && Boolean(errors.userInfo)}
                  helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                  sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                />
              </Form>
            )}
          </Formik>
        ) : (
          value // Display value when not in edit mode
        )}
      </>
    );
  } else {
    element = <span></span>; // Return an empty span for non-editable columns
  }

  return element;
}

RowEditable.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
