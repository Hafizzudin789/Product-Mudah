import React from "react";
import PropTypes from "prop-types";

import "./CommonModal.scss";

class CommonModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { children, handleClose, isDocView, className, containerStyle } = this.props;
        const theContainerStyle = containerStyle ? { ...containerStyle } : {};

        return (
            <div className="common-modal modal row align-items-center" tabIndex="-1" role="dialog">
                <div style={theContainerStyle} className={"modal-dialog " + className} role="document">
                    {isDocView && (
                        <div className="common-dialog__button close" onClick={handleClose}>
                            <img src={require("../../assets/icons/close_white.svg")} className="close__icon" width="48" height="48" />
                        </div>
                    )}

                    <div className={`modal-content ${isDocView ? "modal-content--doc-view" : ""}`}>{children}</div>
                </div>
            </div>
        );
    }
}

CommonModal.propTypes = {
    isDocView: PropTypes.bool,
    children: PropTypes.node,
    handleClose: PropTypes.func,
};

export default CommonModal;
