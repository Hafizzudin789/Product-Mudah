import React from "react";
import "./EditCompanyModal.scss";
import InputComponent from "../../InputComponent";
import Dropdown from "../../Dropdown";
import _ from "lodash";
class EditCompanyModal extends React.Component {
    constructor(props) {
        super(props);
        const { config, value } = this.props;

        this.state = {
            config: _.cloneDeep(config),
            customer: _.cloneDeep(value),
            selectedAro: "",
            selectedMro: {
                name: "",
                value: "",
            },
            arosList: [],
            mrosList: [],
            init: false,
        };
    }

    componentDidMount() {
        if (!_.isEmpty(this.state.customer.aros)) {
            this.setState({
                arosList: [...this.state.customer.aros, this.state.customer.aro],
            });
            this.props.handleMro(this.state.customer.aro.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mrosList: nextProps.value.mros,
        });

        if (!_.isEmpty(nextProps.value.mro) && !this.state.init) {
            this.setState({
                selectedMro: nextProps.value.mro,
                init: true,
            });
        }
    }

    handleChangeInput = (e) => {
        let mutate = this.state.customer;
        mutate[e.type] = e.value;
        this.setState({
            customer: mutate,
        });
    };

    handleDropdown = (e) => {
        let mutate = this.state.customer;
        mutate[e.otherName] = {
            id: e.id,
            lanId: e.name,
            name: e.name,
        };
        this.setState({
            customer: mutate,
        });
    };

    validateData = () => {
        const { customer } = this.state;
        if (!customer.companyName) {
            return false;
        }

        if (!customer.companyRegNo) {
            return false;
        }

        if (!customer.contactNumber) {
            return false;
        }

        return true;
    };

    handleSave = (data) => {
        this.props.handleSave(data);
    };

    displayMRO() {
        if (!_.isEmpty(this.state.mrosList)) {
            return (
                <div className="wrapper-meeting-agenda">
                    <span>MRO</span>
                    <Dropdown
                        title="MRO"
                        classesName="editCompanyDropdown"
                        otherName="mro"
                        data={this.state.mrosList}
                        defaultValue={""}
                        value={this.state.selectedMro.name}
                        handleSelect={this.handleMro}
                        withoutSpan={true}
                    />
                </div>
            );
        }
    }

    handleAro = (e) => {
        let newAroId = {
            id: e.id,
            lanId: e.name,
            name: e.name,
        };

        this.setState((prevState) => ({
            selectedAro: newAroId,
            selectedMro: {
                name: "",
                id: "",
            },
            customer: {
                ...prevState.customer,
                aro: newAroId,
            },
        }));

        this.props.handleMro(e.id);
    };

    handleMro = (e) => {
        let newMroId = {
            id: e.id,
            lanId: e.name,
            name: e.name,
        };

        this.setState((prevState) => ({
            selectedMro: newMroId,
            customer: {
                ...prevState.customer,
                mro: newMroId,
            },
        }));
    };

    render() {
        const { toggle, userRoleLevel } = this.props;
        return (
            <div className="editCompany-modal">
                <div className="editCompany-header">
                    <h3>
                        {"Edit Company Details"}
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="editCompany-content">
                    {userRoleLevel !== 5 && (
                        <div>
                            <div className="wrapper-meeting-agenda">
                                <span>Company Name</span>
                                <InputComponent
                                    name="companyName"
                                    placeholder="Enter company name"
                                    value={this.state.customer.companyName}
                                    withoutSpan={true}
                                    handleChange={this.handleChangeInput}
                                />
                            </div>
                            <div className="wrapper-meeting-agenda">
                                <span>Company Registration Number</span>
                                <InputComponent
                                    name="companyRegNo"
                                    placeholder="Enter registration number"
                                    value={this.state.customer.companyRegNo}
                                    handleChange={this.handleChangeInput}
                                    withoutSpan={true}
                                />
                            </div>
                            <div className="wrapper-meeting-agenda">
                                <span>Company Type</span>
                                <Dropdown
                                    title="Choose company type"
                                    otherName="companyType"
                                    classesName="editCompanyDropdown"
                                    data={this.state.config.customerCategories}
                                    defaultValue={
                                        this.state.customer.companyType
                                            ? this.state.customer.companyType.name
                                                ? this.state.customer.companyType.name
                                                : this.state.customer.companyType
                                            : "Company Type"
                                    }
                                    handleSelect={this.handleDropdown}
                                />
                            </div>
                            <div className="wrapper-meeting-agenda">
                                <span>Industry</span>
                                <Dropdown
                                    title="Select Industry"
                                    classesName="editCompanyDropdown"
                                    otherName="industry"
                                    data={this.state.config.industries}
                                    defaultValue={
                                        this.state.customer.industry && this.state.customer.industry.name
                                            ? this.state.customer.industry.name
                                            : ""
                                    }
                                    handleSelect={this.handleDropdown}
                                />
                            </div>
                            <div className="wrapper-meeting-agenda">
                                <span>Contact Number</span>
                                <InputComponent
                                    name="contactNumber"
                                    placeholder="Enter contact number"
                                    value={this.state.customer.contactNumber}
                                    handleChange={this.handleChangeInput}
                                    withoutSpan={true}
                                />
                            </div>
                        </div>
                    )}

                    {
                        <div className="wrapper-meeting-agenda">
                            <span>CIF</span>
                            <InputComponent
                                name="cif"
                                placeholder="Enter contact number"
                                value={this.state.customer.cif}
                                handleChange={this.handleChangeInput}
                                withoutSpan={true}
                            />
                        </div>
                    }
                    {this.state.arosList.length ? (
                        <div className="wrapper-meeting-agenda">
                            <span>ARO</span>
                            <Dropdown
                                title="Aro"
                                classesName="editCompanyDropdown"
                                otherName="aro"
                                data={this.state.arosList}
                                defaultValue={this.state.customer.aro ? this.state.customer.aro.lanId : ""}
                                value={this.state.selectedAro.lanId}
                                handleSelect={this.handleAro}
                                withoutSpan={true}
                            />
                        </div>
                    ) : (
                        []
                    )}
                    {this.displayMRO()}
                </div>
                <div className="editCompany-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={this.handleSave.bind(this, this.state.customer)} className="btn-submit">
                        Update Details
                    </button>
                </div>
            </div>
        );
    }
}

export default EditCompanyModal;
