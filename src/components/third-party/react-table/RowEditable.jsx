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
    setValue(e.target?.value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;
  let userInfoSchema;
  switch (id) {
    case 'email':
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .number()
          .typeError('Age must be number')
          .required('Age is required')
          .min(18, 'You must be at least 18 years')
          .max(65, 'You must be at most 65 years')
      });
      break;
    case 'visits':
      userInfoSchema = yup.object().shape({
        userInfo: yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

  const isEditable = tableMeta?.selectedRow[row.id];

  switch (columnDef.dataType) {
    case 'text':
      element = (
        <>
          {isEditable ? (
            <>
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
                        handleChange(e);
                        onChange(e);
                      }}
                      onBlur={handleBlur}
                      error={touched.userInfo && Boolean(errors.userInfo)}
                      helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                      sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                    />
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            value
          )}
        </>
      );
      break;
    default:
      element = <span></span>;
      break;
  }

  return element;
}

RowEditable.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
