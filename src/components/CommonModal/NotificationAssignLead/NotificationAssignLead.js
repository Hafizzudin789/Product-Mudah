import React from "react";
import "./NotificationAssignLead.scss";
import Constant from "../../../constant";

class NotificationAssignLead extends React.Component {
    constructor(props) {
        super(props);
    }

    //TODO temp fix close btn
    handleToggle = () => {
        this.props.toggle();
    };

    render() {
        return (
            <div className="confirm">
                <div className="confirm__header">
                    <h3>Notification</h3>
                </div>
                <div className="confirm__content">
                    <div className="row">
                        <div className="col-2" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-8 confirm__content__label-text">{Constant.MSG_NOTIFICATION_ASSIGN}</div>
                        <div className="col-1" />
                    </div>
                    <div className="row">
                        <div className="col-3" />
                        <div className="col-6 text-center">
                            <button className="btn confirm__content__btn" onClick={this.handleToggle}>
                                Close
                            </button>
                        </div>
                        <div className="col-3" />
                    </div>
                </div>
            </div>
        );
    }
}

export default NotificationAssignLead;
