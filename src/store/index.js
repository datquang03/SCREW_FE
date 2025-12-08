// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studioReducer from "../features/studio/studioSlice";
import equipmentReducer from "../features/equipment/equipmentSlice";
import customerReducer from "../features/customer/customerSlice";
import adminCustomerReducer from "../features/admin/admin.customerSlice";
import adminStaffReducer from "../features/admin/admin.staffSlice";
import serviceReducer from "../features/service/serviceSlice";
import adminAnalyticReducer from "../features/admin/admin.analyticSlice";
import promotionReducer from "../features/promotion/promotionSlice";
import bookingReducer from "../features/booking/bookingSlice";
import paymentReducer from "../features/payment/paymentSlice";
import scheduleReducer from "../features/schedule/scheduleSlice";
import setDesignReducer from "../features/setDesign/setDesignSlice";
import commentReducer from "../features/comment/commentSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import notificationReducer from "../features/notification/notificationSlice";
import aiReducer from "../features/AI/AISlice";
import messageReducer from "../features/message/messageSlice";
import uploadReducer from "../features/upload/uploadSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    studio: studioReducer,
    equipment: equipmentReducer,
    customer: customerReducer,
    adminCustomer: adminCustomerReducer,
    adminStaff: adminStaffReducer,
    service: serviceReducer,
    adminAnalytics: adminAnalyticReducer,
    promotion: promotionReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    setDesign: setDesignReducer,
    schedule: scheduleReducer,
    comment: commentReducer,
    transaction: transactionReducer,
    notification: notificationReducer,
    ai: aiReducer,
    message: messageReducer,
    upload: uploadReducer,
  },
});

export default store;
