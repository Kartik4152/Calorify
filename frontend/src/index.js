//dependencies
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

//styles
import "antd/dist/antd.css";
import "./index.scss";
//Components
import App from "./App";

const { store, persistor } = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
