import React from "react";
import "./ShareMultipleProduct.scss";
import InputText from "../../InputText";
import commonUtil from "../../../util/commonUtil";
import { showError } from "./../../../store/common";
import { cloneDeep } from "lodash";
class ShareMultipleProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: {
                email: "",
                title: "",
            },
            titleError: "",
            mailError: "",
        };
    }

    componentDidMount() {
        const { document } = this.props;
        const subjectArray = document && (document || []).map((e) => e.name || "");
        const theSubject = subjectArray.join(" / ");
        this.setState({
            ...this.state,
            mail: {
                ...this.state.mail,
                title: theSubject,
            },
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.document.length === 0) {
            this.handleToggle();
        }
    }

    handleToggle = () => {
        this.props.toggle();
    };

    inputChange = (data) => {
        let mail = cloneDeep(this.state.mail);
        mail[data.type] = data.value;
        this.setState({ mail: mail });
    };

    isValidate = () => {
        const { mail } = this.state;
        let emailErr = "";
        let titleErr = "";
        if (mail.email === "") {
            emailErr = "Email should not empty";
        } else {
            emailErr = "";
        }
        if (mail.title === "") {
            titleErr = "Title should not be empty";
        } else {
            titleErr = "";
        }

        this.setState({
            mailError: emailErr,
            titleError: titleErr,
        });

        return mail.title !== "" && mail.email !== "";
    };

    handleSend = () => {
        if (this.isValidate()) {
            this.props.toggle();
            this.props.sendData(this.state.mail);
        } else {
            commonUtil.dispatch(
                showError({
                    message: "Title and subject should not be empty",
                }),
            );
        }
    };

    render() {
        const { mail, mailError, titleError } = this.state;
        const { document, handleDeleteProduct } = this.props;
        const fileRenderer =
            document &&
            document.map((e) => {
                return (
                    <div key={Math.random()} className="attachedfile">
                        {`${e.name}${e.type ? "." + e.type : ""}`}
                        <span className="text-fileSize"> ({e.fileSize && commonUtil.formatBytes(e.fileSize, 0)})</span>
                        <span className="close-btn">
                            {" "}
                            <img src={require("assets/icons/closed-modal.svg")} onClick={() => handleDeleteProduct(e.id)} />
                        </span>
                    </div>
                );
            });
        return (
            <div className="contactspl-modal">
                <div className="contactspl-modal__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Share to</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>
                <div className="contactspl-modal__content">
                    <div className="contactspl-modal__content__box">
                        <div className="row">
                            <div className="col-12 modallabel">To:</div>
                        </div>
                        <div className="row spacing">
                            <div className="col-12">
                                <InputText directErrorMsg={mailError} value={mail.email} name="email" handleChange={this.inputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 modallabel">Subject:</div>
                        </div>
                        <div className="row spacing">
                            <div className="col-12">
                                <InputText directErrorMsg={titleError} value={mail.title} name="title" handleChange={this.inputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 modallabel">Attached File</div>
                            <div className="col-12">
                                <div className="attachbox">{fileRenderer}</div>
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
                            <button onClick={this.handleSend} className="next-btn">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShareMultipleProduct;
