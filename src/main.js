import "bootstrap";
import _ from "lodash";
import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import createStore from "./store/createStore";
import AppContainer from "./containers/AppContainer";
// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById("root") || document.createElement("div");

if ($(document).width() > 1900) {
    window.gapToLoad = 1000;
} else {
    window.gapToLoad = 600;
}

let render = () => {
    const routes = require("./routes/index").default(store);

    ReactDOM.render(<AppContainer store={store} routes={routes} />, MOUNT_NODE);
};

// This code is excluded from production bundle
if (__DEV__) {
    if (module.hot) {
        // Development render functions
        const renderApp = render;
        const renderError = (error) => {
            const RedBox = require("redbox-react").default;

            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
        };

        // Wrap render in try/catch
        render = () => {
            try {
                renderApp();
            } catch (error) {
                console.error(error);
                renderError(error);
            }
        };

        // Setup hot module replacement
        module.hot.accept("./routes/index", () =>
            setImmediate(() => {
                ReactDOM.unmountComponentAtNode(MOUNT_NODE);
                render();
            }),
        );
    }
}

// ========================================================
// Go!
// ========================================================
render();
export default store;
