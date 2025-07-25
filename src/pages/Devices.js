import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import DeviceList from '../components/devices/DeviceList';
import DeviceForm from '../components/devices/DeviceForm';

const DevicesPage = () => {
  const { id } = useParams();

  return (
    <Routes>
      <Route path="" element={<DeviceList />} />
      <Route path="new" element={<DeviceForm />} />
      <Route path=":id" element={<DeviceForm />} />
    </Routes>
  );
};

export default DevicesPage; 