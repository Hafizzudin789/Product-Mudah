import React from "react";
import PropTypes from "prop-types";
import "./LeadError.scss";

class LeadError extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.setState({ adminUploadConfirm: this.props.adminUploadConfirm });
    }
    //TODO temp fix close btn
    handleToggle = () => {
        this.props.toggle(true);
    };

    sendEmail = () => {
        this.props.sendEmailLead();
        this.props.toggle();
    };

    render() {
        const { msg, isEmailExist } = this.props;
        return (
            <div className="leadError">
                <div className="leadError__header">
                    <h2>Error</h2>
                </div>
                <div className="leadError__content">
                    <div className="row">
                        <div className="col-2" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-8 leadError__content__label-text">{msg}</div>
                        <div className="col-1" />
                    </div>
                    <div className="row">
                        <div className="col-3" />
                        <div className="col-6">
                            <div className="btn-container">
                                {// check if salesPerson passed by backend, if backend pass it, show the send email button
                                isEmailExist && (
                                    <button className="btn leadError__content__default-btn" onClick={this.sendEmail}>
                                        Send Email
                                    </button>
                                )}
                                <button className="btn leadError__content__default-btn" onClick={this.handleToggle}>
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="col-3" />
                    </div>
                </div>
            </div>
        );
    }
}
LeadError.propTypes = {
    msg: PropTypes.string,
    handleConfirm: PropTypes.func,
};

export default LeadError;
