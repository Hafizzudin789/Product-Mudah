import React from "react";
import "./PublishModal.scss";

class PublishModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { msg, handleConfirm, toggle } = this.props;
        return (
            <div className="confirm">
                <div className="confirm__header">
                    <h3>Confirmation</h3>
                </div>
                <div className="confirm__content">
                    <div className="row">
                        <div className="col-2" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-8 confirm__content__label-text">{msg}</div>
                        <div className="col-1" />
                    </div>
                    <div className="row">
                        <div className="col-3" />
                        <div className="col-6">
                            <button className={`btn confirm__content__green-btn`} onClick={handleConfirm}>
                                Confirm
                            </button>
                            <button className="btn confirm__content__default-btn" onClick={toggle}>
                                Cancel
                            </button>
                        </div>
                        <div className="col-3" />
                    </div>
                </div>
            </div>
        );
    }
}

export default PublishModal;
