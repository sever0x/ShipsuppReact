import React from 'react';
import { Grid, TextField } from '@mui/material';

interface PersonalInformationFormProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ formData, handleChange }) => {
    return (
        <Grid container spacing={2} pt={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="phone"
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    );
};

export default PersonalInformationForm;
