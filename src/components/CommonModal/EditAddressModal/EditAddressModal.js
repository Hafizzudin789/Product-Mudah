import React from "react";
import InputComponent from "../../InputComponent";
import "./EditAddressModal.scss";

class EditAddressModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            customerDetail: {},
        };
    }

    componentDidMount() {
        const { config, value } = this.props;
        this.setState({
            config,
            customerDetail: value,
        });
    }

    handleChangeInput = (e) => {
        let mutate = this.state.customerDetail;
        mutate[e.type] = e.value;
        this.setState({
            customerDetail: mutate,
        });
    };

    render() {
        const { toggle, handleSave } = this.props;

        return (
            <div className="editAddress-modal">
                <div className="editAddress-header">
                    <h3>
                        {"Edit Company Address"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="editAddress-content">
                    <div className="wrapper-meeting-agenda">
                        <span>Address</span>
                        <InputComponent
                            name="addressLine1"
                            placeholder="Enter address"
                            value={this.state.customerDetail.addressLine1}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>City</span>
                        <InputComponent
                            name="city"
                            placeholder="Enter city"
                            value={this.state.customerDetail.city}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>State</span>
                        <InputComponent
                            name="state"
                            placeholder="Enter state"
                            value={this.state.customerDetail.state}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                    <div className="wrapper-meeting-agenda">
                        <span>Postcode</span>
                        <InputComponent
                            name="postalCode"
                            placeholder="Enter postcode"
                            value={this.state.customerDetail.postalCode}
                            withoutSpan={true}
                            handleChange={this.handleChangeInput}
                        />
                    </div>
                </div>
                <div className="editAddress-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSave.bind(this, this.state.customerDetail)} className="btn-submit">
                        Update Address
                    </button>
                </div>
            </div>
        );
    }
}

export default EditAddressModal;
