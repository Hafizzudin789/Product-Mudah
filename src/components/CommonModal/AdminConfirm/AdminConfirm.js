import React from "react";
import "./AdminConfirm.scss";
import Dropdown from "../../Dropdown";

class AdminConfirm extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.setState({ adminUploadConfirm: this.props.adminUploadConfirm });
    }
    //TODO temp fix close btn
    handleToggle = () => {
        this.props.toggle();
    };

    handleConfirm = () => {
        const { userAssign, isDeactive, roleLevel } = this.props;
        if ((roleLevel === 2 || roleLevel === 3) && !userAssign.name && isDeactive) {
            return false;
        }
        this.props.toggle();
        this.props.handleConfirm(true);
    };

    render() {
        const { msg, listUserAssignment, userAssign, selectUserAssgin, isDeactive, isSupportDoc, roleLevel } = this.props;
        const showDropdown = this.props.showDropdown ? this.props.showDropdown : false;
        return (
            <div className="confirm">
                <div className="confirm__header">
                    <h3>Confirmation</h3>
                </div>
                <div className="confirm__content">
                    <div className="row">
                        <div className="col-1" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-9 confirm__content__label-text">{msg}</div>
                        <div className="col-1" />
                    </div>
                    {// show dropdown means, it force to show the dropdown because
                    // they want like that, when no user, display 'hey you have no user bro'
                    // to make clear of their client
                    (((roleLevel === 2 || roleLevel === 3) && isDeactive) || showDropdown) && (
                        <div className="row">
                            <div className="col-3" />
                            <div className="col-8 confirm__content__label-text">
                                <Dropdown
                                    data={listUserAssignment}
                                    value={userAssign.name}
                                    defaultValue={showDropdown && listUserAssignment.length == 0 ? "There is no user" : "Select User"}
                                    handleSelect={selectUserAssgin}
                                    disabled={showDropdown && listUserAssignment.length == 0 ? true : false}
                                />
                            </div>
                            <div className="col-1" />
                        </div>
                    )}
                    <div className="row">
                        <div className="col-3" />
                        {!isSupportDoc && (
                            <div className="col-6">
                                <button
                                    className={`btn ${
                                        (roleLevel === 2 || roleLevel === 3) && !userAssign.name && isDeactive
                                            ? "confirm__content__grey-btn"
                                            : "confirm__content__green-btn"
                                    }`}
                                    onClick={this.handleConfirm}>
                                    Confirm
                                </button>
                                <button className="btn confirm__content__default-btn" onClick={this.handleToggle}>
                                    Cancel
                                </button>
                            </div>
                        )}
                        {isSupportDoc && (
                            <div className="col-6 confirm__content__center-align">
                                <button className="btn confirm__content__green-btn" onClick={this.handleConfirm}>
                                    Confirm
                                </button>
                                <button className="btn confirm__content__default-btn" onClick={this.handleToggle}>
                                    Cancel
                                </button>
                            </div>
                        )}
                        <div className="col-3" />
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminConfirm;
