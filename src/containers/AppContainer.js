import React from "react";
import PropTypes from "prop-types";
import { Router } from "react-router";
import { Provider } from "react-redux";
import appHistory from "./appHistory";

class AppContainer extends React.Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { routes, store } = this.props;

        return (
            <Provider store={store}>
                <div style={{ height: "100%" }}>
                    <Router onUpdate={() => window.scrollTo(0, 0)} history={appHistory} children={routes} />
                </div>
            </Provider>
        );
    }
}

export default AppContainer;
