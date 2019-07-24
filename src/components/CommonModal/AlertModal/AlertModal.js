import React from "react";
import "./AlertModal.scss";

class AlertModal extends React.Component {
    constructor(props) {
        super(props);
    }

    handleToggle = () => {
        this.props.toggle();
    };

    render() {
        const { msg, title } = this.props;
        return (
            <div className="alertModal">
                <div className="alertModal__header">
                    <h3> {title ? title : "Alert"}</h3>
                </div>
                <div className="alertModal__content">
                    <div className="row">
                        <div className="col-2" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-6 alertModal__content__label-text">{msg}</div>
                        <div className="col-3" />
                    </div>
                    <div className="row">
                        <div className="col-3" />
                        <div className="col-6">
                            <button className="btn alertModal__content__default-btn" onClick={this.handleToggle}>
                                Ok
                            </button>
                        </div>
                        <div className="col-3" />
                    </div>
                </div>
            </div>
        );
    }
}

export default AlertModal;
