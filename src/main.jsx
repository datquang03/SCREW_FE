import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// ✅ Ant Design phải import TRƯỚC Tailwind
import "antd/dist/reset.css";
import "./index.css"; // Đây là file chứa TailwindCSS
dayjs.locale("vi");

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <Provider store={store}>
    <App />
  </Provider>
);
