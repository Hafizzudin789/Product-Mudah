import React from "react";
import "./CreateCustomerModal.scss";
import _ from "lodash";
import InputComponent from "../../InputComponent";
import Dropdown from "../../Dropdown";

const PointOfContact = ({ data, contactPersonCategories, handleInput, handleSelect }) => {
    return (
        <div className="row form-row">
            <div className="col-12">
                <h4>Contact Details </h4>
                <div className="row form-row">
                    <div className="col-12">
                        <div className="form-label">Full Name</div>
                        <InputComponent
                            placeholder="Enter a full name"
                            isFocus={false}
                            value={data.fullName}
                            name={"fullName"}
                            handleChange={handleInput}
                        />
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-6">
                        <div className="form-label">Type</div>
                        <Dropdown
                            defaultValue="Choose Contact Type"
                            data={contactPersonCategories}
                            value={data.type.name}
                            otherName="type"
                            handleSelect={handleSelect}
                        />
                    </div>
                    <div className="col-6">
                        <div className="form-label">Email</div>
                        <InputComponent placeholder="Enter your email ID" value={data.email} name={"email"} handleChange={handleInput} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-label">Mobile No</div>
                        <InputComponent placeholder="+6012345678" value={data.mobileNo} name={"mobileNo"} handleChange={handleInput} />
                    </div>
                    <div className="col-6">
                        <div className="form-label">Office No</div>
                        <InputComponent
                            placeholder="Enter office Number"
                            value={data.officeNo}
                            name={"officeNo"}
                            handleChange={handleInput}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

class CreateCustomerModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disableCreateBtn: false,
            companyName: props.currentCustomerName ? props.currentCustomerName : "",
            companyRegNo: "",
            companyType: {
                name: "",
            },
            industryType: {
                name: "",
            },
            contactNumber: "",
            address: "",
            city: "",
            state: "",
            postCode: "",

            pOC: [
                {
                    fullName: "",
                    type: {
                        name: "",
                    },
                    email: "",
                    mobileNo: "",
                    officeNo: "",
                },
            ],
        };
        this.errMsg = "";
    }
    componentDidMount() {
        const { initValue } = this.props;
        initValue();
    }

    handleToggle = () => {
        this.props.toggle();
    };

    handleInput = (e) => {
        const value = e.value;
        let val = e.type;
        this.setState({
            [val]: value,
        });
    };

    // componentWillReceiveProps(nextProps){

    // }

    // need this handle because the input value inside an object
    handleInputPoc = (data, index) => {
        const value = data.value;
        const type = data.type;
        let mutate = this.state.pOC;
        mutate[index][type] = value;
        this.setState({
            pOC: mutate,
        });
    };

    handleSelectPoc = (data, index) => {
        const type = data.otherName;
        let mutate = this.state.pOC;
        mutate[index][type] = data;
        this.setState({
            pOC: mutate,
        });
    };

    handleSelect = (e) => {
        const type = e.otherName;
        let mutate = this.state;
        mutate[type] = e;
        this.setState({
            type: [...mutate],
        });
    };

    handleAddAnotherContact = () => {
        let mutate = this.state.pOC;
        const obj = {
            fullName: "",
            type: {
                name: "",
            },
            email: "",
            mobileNo: "",
            officeNo: "",
        };
        mutate = [...mutate, obj];
        this.setState({
            pOC: mutate,
        });
    };

    _validate = () => {
        if (this.state.companyName == "") {
            this.errMsg = "Company name cannot be empty";
            return false;
        }

        if (this.state.companyRegNo == "") {
            this.errMsg = "Company Registration cannot be empty";
            return false;
        }

        if (this.state.companyType.name == "") {
            this.errMsg = "Company type cannot be empty";
            return false;
        }

        if (this.state.industryType.name == "") {
            this.errMsg = "Industry type cannot be empty";
            return false;
        }

        if (this.state.contactNumber == "") {
            this.errMsg = "Contact Number cannot be empty";
            return false;
        }

        if (!this.state.contactNumber.includes("+60")) {
            this.errMsg = "Please write mobile number with correct format e.g: +60123456";
            return false;
        }

        var reg = /^\d+$/;
        if (this.state.contactNumber.includes("+60") && !reg.test(this.state.contactNumber.substring(1, this.state.contactNumber.length))) {
            this.errMsg = "Please write mobile number with correct format e.g: +60123456";
            return false;
        }

        if (this.state.address == "") {
            this.errMsg = "Address cannot be empty";
            return false;
        }

        if (this.state.city == "") {
            this.errMsg = "City cannot be empty";
            return false;
        }

        if (this.state.state == "") {
            this.errMsg = "State cannot be empty";
            return false;
        }

        if (this.state.postCode == "") {
            this.errMsg = "Postcode cannot be empty";
            return false;
        }

        let pocValidate = _.cloneDeep(this.state.pOC)
            .map((e) => {
                let k = true;
                Object.keys(e).forEach((l) => {
                    if (l !== "officeNo") {
                        if (e[l] == "") k = false;
                        if (e[l].name == "") k = false;
                    }
                });
                return k;
            })
            .every((e) => e);

        if (!pocValidate) {
            this.errMsg = "Contact details cannot be empty";
            return false;
        }

        let validatePhoneNumber = _.cloneDeep(this.state.pOC)
            .map((e) => {
                let k = true;
                if (!e.mobileNo.includes("+60")) {
                    k = false;
                } else if (e.mobileNo.includes("+60") && !reg.test(e.mobileNo.substring(1, e.mobileNo.length))) {
                    k = false;
                }
                return k;
            })
            .every((e) => e);

        if (!validatePhoneNumber) {
            this.errMsg = "Please write mobile number with correct format e.g: +60123456";
            return false;
        }

        return true;
    };

    handleSave = () => {
        const { createCustomer } = this.props;
        const industryType = this.state.industryType;
        const companyType = this.state.companyType;
        const city = this.state.city;
        const companyName = this.state.companyName;
        const companyRegNo = this.state.companyRegNo;
        const contactNumber = this.state.contactNumber;
        const postCode = this.state.postCode;
        const state = this.state.state;
        const address = this.state.address;
        const pOC = this.state.pOC;
        const data = {
            industryType,
            companyType,
            city,
            companyName,
            companyRegNo,
            contactNumber,
            postCode,
            state,
            address,
            pOC,
        };
        if (this._validate()) {
            this.setState({ disableCreateBtn: true });
        }
        this._validate() ? createCustomer(data) : alert(this.errMsg);
    };

    render() {
        const { listIndustries, listCompanyTypes, contactPersonCategories } = this.props;
        return (
            <div className="create-cust">
                <div className="create-cust__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Create New Company</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>

                <div className="create-cust__content">
                    <div className="row form-row">
                        <div className="col-12">
                            <div className="form-label">Company name</div>
                            <InputComponent
                                placeholder="Enter company name"
                                isFocus={false}
                                name="companyName"
                                value={this.state.companyName}
                                handleChange={this.handleInput}
                            />
                        </div>
                    </div>
                    <div className="row form-row">
                        <div className="col-6">
                            <div className="form-label">Company Registration Number</div>
                            <InputComponent
                                name="companyRegNo"
                                placeholder="Enter registration number"
                                value={this.state.companyRegNo}
                                handleChange={this.handleInput}
                            />
                        </div>
                        <div className="col-6">
                            <div className="form-label">Company Type</div>
                            <Dropdown
                                defaultValue="Choose company type"
                                data={listCompanyTypes}
                                value={this.state.companyType.name}
                                otherName="companyType"
                                handleSelect={this.handleSelect}
                            />
                        </div>
                    </div>
                    <div className="row form-row">
                        <div className="col-6">
                            <div className="form-label">Industry</div>
                            <Dropdown
                                defaultValue="Select industry"
                                data={listIndustries}
                                value={this.state.industryType.name}
                                otherName="industryType"
                                handleSelect={this.handleSelect}
                            />
                        </div>
                        <div className="col-6">
                            <div className="form-label">Contact Number</div>
                            <InputComponent
                                name="contactNumber"
                                placeholder="+6012345678"
                                value={this.state.contactNumber}
                                handleChange={this.handleInput}
                            />
                        </div>
                    </div>
                    <div className="row form-row">
                        <div className="col-12">
                            <div className="form-label">Address</div>
                            <InputComponent
                                name="address"
                                placeholder="Enter a full address"
                                isFocus={false}
                                value={this.state.address}
                                handleChange={this.handleInput}
                            />
                        </div>
                    </div>
                    <div className="row form-row">
                        <div className="col-12">
                            <div className="form-label">City</div>
                            <InputComponent
                                name="city"
                                placeholder="Enter a city name"
                                isFocus={false}
                                value={this.state.city}
                                handleChange={this.handleInput}
                            />
                        </div>
                    </div>
                    <div className="row form-row">
                        <div className="col-6">
                            <div className="form-label">State</div>
                            <InputComponent
                                placeholder="Enter State"
                                name="state"
                                value={this.state.state}
                                handleChange={this.handleInput}
                            />
                        </div>
                        <div className="col-6">
                            <div className="form-label">Postcode</div>
                            <InputComponent
                                placeholder="Enter Postcode"
                                name="postCode"
                                value={this.state.postCode}
                                handleChange={this.handleInput}
                            />
                        </div>
                    </div>

                    {this.state.pOC.map((item, index) => (
                        <PointOfContact
                            key={index}
                            data={item}
                            contactPersonCategories={contactPersonCategories}
                            handleInput={(e) => this.handleInputPoc(e, index)}
                            handleSelect={(e) => this.handleSelectPoc(e, index)}
                        />
                    ))}

                    <div className="row form-row">
                        <div onClick={this.handleAddAnotherContact} className="col-5 form-link">
                            + Add Another Contact
                        </div>
                        <div className="col-7" />
                    </div>
                </div>
                <div className="create-cust__footer">
                    <div className="row">
                        <div className="col-5" />
                        <div className="col-7">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <span onClick={this.handleSave} className="next-btn" disabled={this.state.disableCreateBtn}>
                                Create Customer
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCustomerModal;
