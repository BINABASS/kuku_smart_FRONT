import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeviceList from '../components/devices/DeviceList';
import DeviceForm from '../components/devices/DeviceForm';
import { useManagerGuard, usePremiumGuard } from '../utils/rbacMiddleware';

const DevicesPage = () => {
  const isManager = useManagerGuard();
  const isPremium = usePremiumGuard();

  if (!isManager) {
    return <div>You do not have permission to access this page</div>;
  }

  return (
    <Routes>
      <Route path="" element={<DeviceList />} />
      <Route path="new" element={isPremium ? <DeviceForm /> : <div>Premium subscription required to add new devices</div>} />
      <Route path=":id" element={<DeviceForm />} />
    </Routes>
  );
};

export default DevicesPage; 