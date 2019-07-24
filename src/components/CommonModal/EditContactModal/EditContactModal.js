import React from "react";
import Dropdown from "../../Dropdown";
import InputComponent from "../../InputComponent";
import "./EditContactModal.scss";

class EditContactModal extends React.Component {
    constructor(props) {
        super(props);
        const { config, value, indexToEdit } = this.props;
        this.state = {
            customerDetail: value,
            index: indexToEdit,
            config,
        };
    }

    handleDropdown = (e) => {
        let mutate = this.state.customerDetail;
        mutate.contactPersons[this.state.index][e.type] = e;
        this.setState({ customerDetail: mutate });
    };

    handleChangeInput = (e) => {
        let mutate = this.state.customerDetail;
        mutate.contactPersons[this.state.index][e.type] = e.value;
        this.setState({
            customerDetail: mutate,
        });
    };

    render() {
        const { toggle, handleSave } = this.props;
        const { index } = this.state;
        return (
            <div className="editContact-modal">
                <div className="editContact-header">
                    <h3>
                        {"Edit Contact 1 Details"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="editContact-content">
                    <div className="wrapper-meeting-agenda">
                        <span>Contact name</span>
                        <InputComponent
                            name="name"
                            placeholder="Enter contact name"
                            value={this.state.customerDetail.contactPersons[index].name}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>Type</span>
                        <Dropdown
                            name="contactPersonCategory"
                            classesName="editCompanyDropdown"
                            data={this.state.config.contactPersonCategories}
                            value={
                                this.state.customerDetail.contactPersons[index].contactPersonCategory
                                    ? this.state.customerDetail.contactPersons[index].contactPersonCategory.name
                                    : ""
                            }
                            handleSelect={this.handleDropdown}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>Email</span>
                        <InputComponent
                            name="email"
                            placeholder="Enter email Id"
                            value={this.state.customerDetail.contactPersons[index].email}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>Mobile Number</span>
                        <InputComponent
                            name="mobile"
                            placeholder="Enter mobile number"
                            value={this.state.customerDetail.contactPersons[index].mobile}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>Office Number</span>
                        <InputComponent
                            name="phone"
                            placeholder="Enter office number"
                            value={this.state.customerDetail.contactPersons[index].phone}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                </div>
                <div className="editContact-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSave.bind(this, this.state.customerDetail)} className="btn-submit">
                        Update Details
                    </button>
                </div>
            </div>
        );
    }
}

export default EditContactModal;
