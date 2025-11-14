// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studioReducer from "../features/studio/studioSlice";
import equipmentReducer from "../features/equipment/equipmentSlice";
import customerReducer from "../features/customer/customerSlice";
import adminCustomerReducer from "../features/admin/admin.customerSlice";
import adminStaffReducer from "../features/admin/admin.staffSlice";
import serviceReducer from "../features/service/serviceSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    studio: studioReducer,
    equipment: equipmentReducer,
    customer: customerReducer,
    adminCustomer: adminCustomerReducer,
    adminStaff: adminStaffReducer,
    service: serviceReducer,
  },
});

export default store;
