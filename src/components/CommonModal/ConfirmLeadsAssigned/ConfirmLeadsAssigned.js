import "./ConfirmLeadsAssigned.scss";
import _ from "lodash";
import React, { Component } from "react";

export default class ConfirmLeadsAssigned extends Component {
    render() {
        const { msg, toggle, handleSave } = this.props;
        return (
            <div className="confirm">
                <div className="confirm__header">
                    <h3>Confirmation</h3>
                </div>
                <div className="confirm__content">
                    <div className="row">
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-10 confirm__content__label-text">{!_.isEmpty(msg) && msg.message}</div>
                        <div className="col-1" />
                    </div>
                </div>
                <div className="confirm__footer">
                    <div className="row">
                        <div className="col-12 confirm__footer__right-align">
                            <button onClick={toggle} className="btn confirm__footer__default-btn">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="btn confirm__footer__green-btn">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
