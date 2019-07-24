import React from "react";
import "./CoreLayout.scss";
import "../../styles/core.scss";
import PropTypes from "prop-types";

export const CoreLayout = ({ children }) => (
    <div className="core-layout__viewport">
        {children}
    </div>
);

CoreLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default CoreLayout;
