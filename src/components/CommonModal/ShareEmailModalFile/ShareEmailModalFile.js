import React from "react";
import "./ShareEmailModalFile.scss";
import InputText from "../../InputText";
import validation from "../../../util/validations";

class ShareEmailModalFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: {
                emailId: "",
                title: "",
            },
            inputfileValue: "",
            files: [
                {
                    name: "",
                    content: "",
                },
            ],
            fileName: "",
            mailError: "",
            titleError: "",
        };
    }

    handleToggle = () => {
        this.props.toggle();
    };

    inputChange = (data) => {
        let mail = this.state;
        mail[data.type] = data.value;
        this.setState({ mail: mail, titleError: "", mailError: "" });
    };

    sendEmail = () => {
        const { mail } = this.state;
        if (this.valaidateMail()) {
            this.props.sendData(mail);
            this.handleToggle();
        }
    };

    valaidateMail = () => {
        const { mail } = this.state;
        if (!mail.emailId) {
            this.setState({ mailError: "Please enter the recipient's email address" });
            return false;
        }
        if (!validation.checkEmail(mail.emailId)) {
            this.setState({ mailError: "Email in invalid format" });
            return false;
        }
        if (this.props.isShowTitle) {
            if (!mail.title) {
                this.setState({ titleError: "Please fill title" });
                return false;
            }
        }
        return true;
    };

    render() {
        const { mail, mailError, titleError } = this.state;
        return (
            <div className="share-modal">
                <div className="share-modal__header">
                    <h3>Share as attachment to this email</h3>
                </div>
                <div className="share-modal__content">
                    <div className="share-modal__content__container">
                        <InputText
                            directErrorMsg={mailError}
                            value={mail.emailId}
                            name="emailId"
                            placeholder="Email Id "
                            handleChange={this.inputChange}
                        />
                    </div>
                    {this.props.isShowTitle && (
                        <div className="share-modal__content__container">
                            <InputText
                                directErrorMsg={titleError}
                                value={mail.title}
                                name="title"
                                placeholder="Title "
                                handleChange={this.inputChange}
                            />
                        </div>
                    )}
                </div>
                <div className="share-modal__footer">
                    <div>
                        <button className="btn share-modal__footer__send-btn" onClick={this.sendEmail.bind(this)}>
                            Send Email
                        </button>
                    </div>
                    <div>
                        <button className="btn share-modal__footer__default-btn" onClick={this.handleToggle}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShareEmailModalFile;
