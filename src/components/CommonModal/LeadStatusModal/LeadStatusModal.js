import React from "react";
import "./LeadStatusModal.scss";
import InputComponent from "../../InputComponent";
import _ from "lodash";

class LeadStatusModal extends React.Component {
    constructor(props) {
        super(props);
        const { config, value } = this.props;
        this.state = {
            config: _.cloneDeep(config),
            customerDetail: _.cloneDeep(value),
        };
    }

    componentDidMount() {}

    handleChangeInput = (e) => {
        let mutate = this.state.customerDetail;
        mutate[e.type] = e.value;
        this.setState({
            customerDetail: mutate,
        });
    };

    render() {
        const { toggle } = this.props;

        return (
            <div className="statusModal">
                <div className="statusModal-header">
                    <h3>
                        {"Move To Submission"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="statusModal-content">
                    <div className="row">
                        <div className="col-12">
                            <h6>
                                Before you can move <span>XXXX lead</span>
                                to <span>Submission</span> you will need to update these products
                            </h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <h5>Products Requested</h5>
                        </div>
                        <div className="col-4">
                            <h5>Submission Value</h5>
                        </div>
                    </div>

                    {/* Apply map to below div row */}
                    <div className="row">
                        <div className="col-8 prod-name">
                            <span>
                                <img src={require("assets/icons/close.svg")} onClick={toggle} />
                            </span>
                            BizPower SME Business Loan for Working Capital Needs
                        </div>
                        <div className="col-4">
                            <InputComponent
                                name="address"
                                placeholder="0.000M"
                                value=""
                                withoutSpan={true}
                                handleChange={this.handleChangeInput}
                            />
                        </div>
                    </div>
                </div>
                <div className="statusModal-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button className="btn-submit">Confirm </button>
                </div>
            </div>
        );
    }
}

export default LeadStatusModal;
