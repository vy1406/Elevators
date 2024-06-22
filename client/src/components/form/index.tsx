import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { FormComponentProps, FormValues } from '../interfaces';

const INIT_VALUES: FormValues = {
  floors: 5,
  elevators: 1,
  randomAssigned: false,
};

const FormComponent: React.FC<FormComponentProps> = ({ onSubmit, onReset }) => {

  return (
    <Formik
      initialValues={INIT_VALUES}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Typography variant="h5" component="h1" gutterBottom>
              Elevator Assignment Form
            </Typography>
            
            <Typography gutterBottom>Floors: {values.floors}</Typography>
            <Slider
              name="floors"
              min={1}
              max={40}
              value={values.floors}
              onChange={(_, value) => setFieldValue('floors', value)}
              onBlur={handleBlur}
              valueLabelDisplay="auto"
              marks
            />
            
            <Typography gutterBottom>Elevators: {values.elevators}</Typography>
            <Slider
              name="elevators"
              min={1}
              max={10}
              value={values.elevators}
              onChange={(_, value) => setFieldValue('elevators', value)}
              onBlur={handleBlur}
              valueLabelDisplay="auto"
              marks
            />
            
            {/* <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="randomAssigned"
                  color="primary"
                  onChange={handleChange}
                  checked={values.randomAssigned}
                />
              }
              label="Randomly Assign Elevators to Floors"
            /> */}
            
            <Button type="submit" variant="contained" color="primary">
              Generate
            </Button>
            <IconButton 
              onClick={() => onReset()} 
              color="secondary"
              style={{ marginTop: '10px' }}
            >
              <RestoreIcon />
            </IconButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
