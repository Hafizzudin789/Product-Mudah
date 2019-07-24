import React from "react";
import "./ContactSpecialistModal.scss";
import InputText from "../../InputText";
import validation from "../../../util/validations";
import TextArea from "../../TextArea";
import { cloneDeep } from "lodash";
class ContactSpecialistModal extends React.Component {
    constructor(props) {
        super(props);
        const { contactSpecialist } = this.props || {};
        this.state = {
            mail: {
                to: (contactSpecialist && contactSpecialist.email) || "",
                cc: (contactSpecialist && contactSpecialist.ccEmail) || "",
                productInquiry: "",
                msg: "",
            },
            error: {
                toError: "",
                ccError: "",
                msgError: "",
                productInquiryError: "",
            },
        };
    }

    componentDidMount() {
        const { productTitle } = this.props || "";
        this.setState({
            mail: {
                ...this.state.mail,
                productInquiry: productTitle,
            },
        });
    }

    handleToggle = () => {
        this.props.toggle();
    };

    inputChange = (data) => {
        let { mail } = cloneDeep(this.state);
        mail[data.type] = data.value;
        this.setState({ mail: mail });
    };

    sendEmail = () => {
        const { mail } = cloneDeep(this.state);
        const { sendEmailToSpecialist } = this.props;

        if (this.validate()) {
            const dataToSend = {
                subject: mail.productInquiry || "",
                msg: mail.msg,
                toList: this.trimAndSplit(mail.to),
                CcList: this.trimAndSplit(mail.cc),
            };
            sendEmailToSpecialist(dataToSend);
            this.handleToggle();
        }
    };

    trimAndSplit = (str) => {
        const trim = str.replace(/\s/g, "");
        return trim.split(",");
    };

    validate = () => {
        const { mail } = cloneDeep(this.state) || {};
        const toEmail = this.trimAndSplit(mail.to);
        const ccEmail = this.trimAndSplit(mail.cc);
        let toError = "";
        let ccError = "";
        let msgError = "";

        toEmail.forEach((email) => {
            if (!validation.checkEmail(email)) {
                toError = "Invalid Email Format";
            }
        });

        ccEmail.forEach((email) => {
            if (!validation.checkEmail(email)) {
                ccError = "Invalid Email Format";
            }
        });

        if (mail.msg === "") msgError = "Message cannot be empty";

        this.setState((prevState) => ({
            error: {
                ...prevState.error,
                toError,
                ccError,
                msgError,
            },
        }));

        // with double exclamation mark we can do this !!!ccError && !!!toError && !!!msgError
        const isPass = ccError === "" && toError === "" && msgError === "";

        return isPass;
    };

    render() {
        const { mail, error } = cloneDeep(this.state);
        return (
            <div className="contactspl-modal">
                <div className="contactspl-modal__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Contact Specialist</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>
                <div className="contactspl-modal__content">
                    <div className="contactspl-modal__content__box">
                        <div className="row">
                            <div className="col-3 modallabel">To:</div>
                            <div className="col-9">
                                <InputText directErrorMsg={error["toError"]} value={mail.to} name="to" handleChange={this.inputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 modallabel">Cc:</div>
                            <div className="col-9">
                                <InputText directErrorMsg={error["ccError"]} value={mail.cc} name="cc" handleChange={this.inputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 modallabel">Product Inquiry:</div>
                            <div className="col-9">
                                <InputText value={mail.productInquiry} name="productInquiry" handleChange={this.inputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="contactspl-modal__content__subjectbox">
                        <div className="row">
                            <div className="col-12">
                                <TextArea
                                    name="msg"
                                    value={mail.msg}
                                    handleChange={this.inputChange}
                                    placeholder="Enter Message"
                                    messageError={this.state.error.msgError}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contactspl-modal__footer">
                    <div className="row">
                        <div className="col-12">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button onClick={() => this.sendEmail()} className="next-btn">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactSpecialistModal;
