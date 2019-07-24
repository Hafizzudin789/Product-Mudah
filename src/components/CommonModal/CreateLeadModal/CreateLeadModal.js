import React from "react";
import "./CreateLeadModal.scss";
import _ from "lodash";
import InputComponent from "../../InputComponent";
import Dropdown from "../../Dropdown";
import Select from "react-select";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import util from "../../../util/commonUtil";

class CreateLeadModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: {
                name: "",
            },
            estimatedValue: "",
            status: {
                name: "",
            },
            divisionCode: {
                name: "",
            },
            accountType: {
                name: "islamic",
                id: 1,
            },
            products: [],
            smeProducts: [],
            meetingSchedule: {
                exist: false,
                title: "",
                scheduleMeetingTimeForBackend: new Date(),
            },
            remark: {
                exist: false,
                title: "",
            },
            salesPerson: [],
            selectedSalesPerson: {
                label: "",
                value: "",
            },
            salesManager: this.props.salesManager ? this.props.salesManager : [],
            selectedSalesManager: {
                name: "",
            },
        };
        this.errMsg = "";
        moment.locale("en");
        momentLocalizer();
    }

    // REACT LIFECYCLE---------------------------

    componentDidMount() {
        const { initValue } = this.props;
        initValue();
    }

    setSalesPerson = async (salesPerson) => {
        const salesPersons = await salesPerson;
        this.setState({
            salesPerson: salesPersons.users,
        });
    };

    async componentWillReceiveProps(props) {
        const { company, getSalesPerson } = props;
        if (!_.isEmpty(company)) {
            if (props.roleLevel == 2) {
                const salesPerson = await getSalesPerson(company.id);
                this.setSalesPerson(salesPerson);
            }
        }
    }

    // REACT LIFECYCLE---------------------------

    handleToggle = () => {
        this.props.toggle();
    };

    handleSelect = async (e) => {
        const type = e.type;
        let mutate = this.state;

        mutate[type] = e;
        this.setState({
            type: [...mutate],
        });

        if (this.props.roleLevel > 2 && type === "selectedSalesManager") {
            const { handleDropdownSalesManager, company } = this.props;
            const salesPersons = await handleDropdownSalesManager(e, company.id);
            this.setState({
                salesPerson: salesPersons,
                selectedSalesPerson: {
                    value: "",
                    label: "",
                },
            });
        }
    };

    handleInput = (e) => {
        const value = e.value;
        let val = e.type;
        if (val.includes(".")) {
            //for nested value input inside object
            let k = e.type
                .replace(/]/g, "")
                .replace(/\[/g, ".")
                .split(".");
            this.setState((prevState) => ({
                [k[0]]: {
                    ...prevState[k[0]],
                    [k[1]]: e.value,
                },
            }));
        } else {
            this.setState({
                [val]: value,
            });
        }
    };

    _formatDataConfigLeads(type, data) {
        if (!data) return [];
        switch (type) {
            case "sme":
                data = _.uniqBy(data, function(e) {
                    return e.productName;
                });
                data = _.sortBy(data, (i) => {
                    return i.productName;
                });
                data.forEach((item) => {
                    item.name = item.productName;
                    item.label = item.productName;
                    item.value = item.id;
                });
                return _.filter(data, (pro) => {
                    return pro.productType && pro.productType.name === "SME";
                });
            case "crossSelling":
                data = _.uniqBy(data, function(e) {
                    return e.productName;
                });
                data = _.sortBy(data, (i) => {
                    return i.productName;
                });
                data.forEach((item) => {
                    item.name = item.productName;
                    item.label = item.productName;
                    item.value = item.id;
                });
                return _.filter(data, (pro) => {
                    return pro.productType && pro.productType.name === "NON SME";
                });
            default:
                return [];
        }
    }

    setAccountType = (e) => {
        let data = {
            name: e.target.value,
            id: e.target.value.toLowerCase() == "islamic" ? 1 : 2,
        };
        this.setState({
            accountType: data,
        });
    };

    productChange = (data) => {
        this.setState({
            products: [...data],
        });
    };

    smeProductChange = (data) => {
        this.setState({
            smeProducts: [...data],
        });
    };

    showComponent = (componentName) => {
        let arr = this.state[componentName];
        arr.exist = true;
        this.setState({
            [componentName]: arr,
        });
    };

    handleChangeSchedule = (e) => {
        const dateForBackend = util.parseMeetingScheduleDateForBackend(e);
        let arr = this.state.meetingSchedule;
        arr.scheduleMeetingTimeForBackend = dateForBackend;
        arr.exist = true;
        this.setState({
            meetingSchedule: arr,
        });
    };

    _validate = () => {
        let output = true;

        if (this.state.category.name == "") {
            this.errMsg = "Category cannot be empty";
            output = false;
            return false;
        }

        if (this.state.estimatedValue == "") {
            this.errMsg = "Estimated Value cannot be empty";
            output = false;
            return false;
        }

        if (!util.is_numeric(this.state.estimatedValue)) {
            this.errMsg = "Estimated Value should be numeric";
            output = false;
            return false;
        }

        if (this.state.status.name == "") {
            this.errMsg = "Status cannot be empty";
            output = false;
            return false;
        }

        if (this.state.divisionCode.name == "") {
            this.errMsg = "Division Code cannot be empty";
            output = false;
            return false;
        }

        if (this.props.roleLevel > 2) {
            if (this.state.selectedSalesManager.name == "") {
                this.errMsg = "Sales Manager cannot be empty";
                output = false;
                return false;
            }
        }

        if (!this.state.smeProducts.length) {
            this.errMsg = "SME Product cannot be empty";
            output = false;
            return false;
        }

        return output;
    };

    handleSave = () => {
        const { handleSaveLead } = this.props;
        const mergedProducts = [...this.state.smeProducts, ...this.state.products];
        const category = this.state.category;
        const status = this.state.status;
        const estimatedValue = this.state.estimatedValue;
        const remark = this.state.remark.title;
        const scheduleMeeting = this.state.meetingSchedule;
        const accountType = this.state.accountType.id;
        const divisionId = this.state.divisionCode.id;
        const salesPerson = this.state.selectedSalesPerson;
        const salesManager = this.state.selectedSalesManager;

        if (this._validate()) {
            handleSaveLead(
                mergedProducts,
                category,
                status,
                estimatedValue,
                remark,
                scheduleMeeting,
                accountType,
                divisionId,
                salesPerson,
                salesManager,
            );
            this.props.toggle();
        } else alert(this.errMsg);
    };

    handleSelectSalesPerson = (data) => {
        if (data === null)
            this.setState({
                selectedSalesPerson: {
                    value: "",
                    label: "",
                },
            });
        else
            this.setState({
                selectedSalesPerson: {
                    value: data.value,
                    label: data.label,
                },
            });
    };

    render() {
        const { data, searchCompany, company, roleLevel } = this.props;
        const isCompanyEmpty = _.isEmpty(company) ? "hide" : "";
        const smeProducts = this._formatDataConfigLeads("sme", data.products);
        const products = this._formatDataConfigLeads("crossSelling", data.products);
        const salesPersonFormat = this.state.salesPerson.length
            ? _.cloneDeep(this.state.salesPerson).map((e) => {
                  e.value = e.id;
                  e.label = e.name;
                  return e;
              })
            : [];
        let _formatleadInitValue =
            !_.isEmpty(data.leadDivisions) &&
            data.leadDivisions.map((e) => {
                let k = Object.assign({}, e);
                k.name = `${e.code} - ${e.name}`;
                return k;
            });
        return (
            <div className="create-lead">
                <div className="create-lead__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Create New Lead</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>

                <div className="create-lead__content">
                    <div className="row">
                        <div className="col-12 form-row">
                            <div className="form-label">Company name</div>
                            {searchCompany}
                        </div>
                    </div>
                    <div className={"company " + isCompanyEmpty}>
                        <div className="row form-row">
                            <div className="col-6">
                                <div className="form-label">Category</div>
                                <Dropdown
                                    data={data.leadCategories}
                                    defaultValue="Choose a category"
                                    handleSelect={this.handleSelect}
                                    value={this.state.category.name}
                                    name="category"
                                />
                            </div>
                            <div className="col-6">
                                <div className="form-label">Estimated Value</div>
                                <InputComponent
                                    placeholder="Enter estimated value"
                                    name="estimatedValue"
                                    handleChange={this.handleInput}
                                    value={this.state.estimatedValue}
                                />
                            </div>
                        </div>
                        <div className="row form-row">
                            <div className="col-6">
                                <div className="form-label">Status</div>
                                <Dropdown
                                    // only show 'pending initial status when creating the lead
                                    data={
                                        !_.isEmpty(data.level1Statuses) &&
                                        data.level1Statuses.filter((e) => e.name == "Pending Initial Contact")
                                    }
                                    defaultValue="Choose a Status"
                                    handleSelect={this.handleSelect}
                                    value={this.state.status.name}
                                    name="status"
                                />
                            </div>
                            <div className="col-6">
                                <div className="form-label">Division Code</div>
                                <Dropdown
                                    data={_formatleadInitValue}
                                    defaultValue="Enter division code"
                                    handleSelect={this.handleSelect}
                                    value={this.state.divisionCode.name}
                                    name="divisionCode"
                                />
                            </div>
                        </div>

                        <div className="row form-row account-type-section">
                            <div className="col-12">
                                <div className="form-label">Account Type </div>
                                <div className="row">
                                    <div className="col-4 flex">
                                        <input
                                            onClick={this.setAccountType}
                                            defaultChecked
                                            type="radio"
                                            id="radio1a"
                                            name="AccountType"
                                            value="islamic"
                                        />
                                        <label htmlFor="radio1a">
                                            <span> Islamic</span>
                                        </label>
                                    </div>
                                    <div className="col-4 flex">
                                        <input
                                            onClick={this.setAccountType}
                                            type="radio"
                                            id="radio2a"
                                            name="AccountType"
                                            value="conventional"
                                        />
                                        <label htmlFor="radio2a">
                                            <span> Conventional</span>
                                        </label>
                                    </div>
                                    <div className="col-6" />
                                </div>
                            </div>
                        </div>

                        {// for L3 create lead, because sales manager is mandatory
                        roleLevel > 2 && (
                            <div className="row form-row">
                                <div className="col-12">
                                    <div className="form-label">Sales Manager</div>
                                    <Dropdown
                                        data={this.state.salesManager}
                                        defaultValue="Choose a Sales Manager"
                                        handleSelect={this.handleSelect}
                                        value={this.state.selectedSalesManager.name}
                                        name="selectedSalesManager"
                                    />
                                </div>
                            </div>
                        )}

                        {((roleLevel == 3 && this.state.selectedSalesManager.name !== "") || roleLevel == 2) && (
                            <div className="row form-row">
                                <div className="col-12">
                                    <div className="form-label">Sales Person</div>
                                    <Select
                                        isClearable
                                        name="colors"
                                        options={salesPersonFormat}
                                        value={this.state.selectedSalesPerson}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={this.handleSelectSalesPerson}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="row form-row">
                            <div className="col-12">
                                <div className="form-label">SME Products</div>
                                <Select
                                    isMulti
                                    name="colors"
                                    options={smeProducts}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    closeMenuOnSelect={false}
                                    onChange={this.smeProductChange}
                                />
                            </div>
                        </div>
                        <div className="row form-row">
                            <div className="col-12">
                                <div className="form-label">Cross-Sell Products</div>
                                <Select
                                    isMulti
                                    name="colors"
                                    options={products}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    closeMenuOnSelect={false}
                                    onChange={this.productChange}
                                />
                            </div>
                        </div>
                        {this.state.meetingSchedule.exist && (
                            <div className="wrapper-meeting">
                                <div className="input">
                                    <div className="form-label">Meeting Title</div>
                                    <InputComponent
                                        placeholder="Meeting Title..."
                                        name="meetingSchedule.title"
                                        handleChange={this.handleInput}
                                        value={this.state.meetingSchedule.title}
                                    />
                                </div>
                                <DateTimePicker
                                    onChange={this.handleChangeSchedule}
                                    value={
                                        this.state.meetingSchedule
                                            ? moment(this.state.meetingSchedule.scheduleMeetingTimeForBackend).toDate()
                                            : new Date()
                                    }
                                />
                            </div>
                        )}

                        {this.state.remark.exist && (
                            <div className="wrapper-meeting">
                                <div className="form-label">Remark</div>
                                <InputComponent
                                    placeholder="Remark..."
                                    name="remark.title"
                                    handleChange={this.handleInput}
                                    value={this.state.remark.title}
                                />
                            </div>
                        )}
                        <div className="row form-row">
                            {!this.state.meetingSchedule.exist && (
                                <div onClick={() => this.showComponent("meetingSchedule")} className="col-3 form-link">
                                    + Schedule Meeting
                                </div>
                            )}
                            {!this.state.remark.exist && (
                                <div onClick={() => this.showComponent("remark")} className="col-3 form-link">
                                    + Add Remark
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="create-lead__footer">
                    <div className="row">
                        <div className="col-7" />
                        <div className="col-5 flex">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button disabled={_.isEmpty(company) ? true : false} className="next-btn" onClick={this.handleSave}>
                                Create Lead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateLeadModal;
