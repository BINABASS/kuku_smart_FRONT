import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import VitalSignsList from '../components/vitals/VitalSignsList';
import VitalSignsForm from '../components/vitals/VitalSignsForm';
import Chart from 'react-apexcharts';

const VitalSignsPage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedVital, setSelectedVital] = useState(null);
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Temperature (°C)',
                data: [],
            },
            {
                name: 'Weight (g)',
                data: [],
            },
            {
                name: 'Mortality (%)',
                data: [],
            },
        ],
        options: {
            chart: {
                type: 'line',
                height: 350,
            },
            xaxis: {
                type: 'datetime',
                categories: [],
            },
            tooltip: {
                y: {
                    formatter: function (val, series) {
                        if (series.name === 'Temperature (°C)') {
                            return `${val}°C`;
                        } else if (series.name === 'Weight (g)') {
                            return `${val}g`;
                        } else {
                            return `${val}%`;
                        }
                    },
                },
            },
        },
    });

    const handleOpenForm = (vital = null) => {
        setSelectedVital(vital);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedVital(null);
        setOpenForm(false);
    };

    const updateChartData = (vitals) => {
        const dates = vitals.map(v => new Date(v.date).getTime());
        const temperatures = vitals.map(v => v.temperature);
        const weights = vitals.map(v => v.weight);
        const mortalities = vitals.map(v => v.mortality);

        setChartData({
            ...chartData,
            options: {
                ...chartData.options,
                xaxis: {
                    ...chartData.options.xaxis,
                    categories: dates,
                },
            },
            series: [
                {
                    name: 'Temperature (°C)',
                    data: temperatures,
                },
                {
                    name: 'Weight (g)',
                    data: weights,
                },
                {
                    name: 'Mortality (%)',
                    data: mortalities,
                },
            ],
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Vital Signs Monitoring
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenForm()}
                    >
                        Add New Measurement
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        height={350}
                    />
                </Grid>
                <Grid item xs={12}>
                    <VitalSignsList onEdit={handleOpenForm} />
                </Grid>
            </Grid>
            <VitalSignsForm
                open={openForm}
                onClose={handleCloseForm}
                vital={selectedVital}
                onChartUpdate={updateChartData}
            />
        </Box>
    );
};

export default VitalSignsPage;
