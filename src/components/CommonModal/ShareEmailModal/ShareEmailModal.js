import React from "react";
import "./ShareEmailModal.scss";
import InputText from "../../InputText";
import validation from "../../../util/validations";
import CommonUtil from "../../../util/commonUtil";
import html2canvas from "html2canvas";
import commonUtil from "../../../util/commonUtil";

class ShareEmailModal extends React.Component {
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

    componentDidMount() {
        const { content, printableAreas } = this.props;
        if (content) {
            html2canvas(content).then((canvas) => {
                this.addFile(canvas);
            });
        }
        if (printableAreas) {
            commonUtil
                .convertHTML2PDF(printableAreas)
                .then((file) => {
                    const { maxSizeLimit, handleShareError } = this.props;
                    if (handleShareError && maxSizeLimit && !CommonUtil.checkSize(file.size, maxSizeLimit)) {
                        handleShareError();
                        return;
                    }
                    CommonUtil.zipFile(file, null, this.callbackUpload);
                    this.setState({ size: file.size, fileName: this.props.name + ".pdf", titleError: "" });
                })
                .catch(() => {});
        }
    }

    addFile = (canvas) => {
        const file = commonUtil.convertCanvas2PDF([canvas]);
        if (["application/pdf"].indexOf(file.type) > -1) {
            CommonUtil.zipFile(file, null, this.callbackUpload);
            this.setState({ size: file.size, fileName: this.props.name + ".pdf", titleError: "" });
        }
    };

    handleToggle = () => {
        this.props.toggle();
    };

    inputChange = (data) => {
        let mail = this.state;
        mail[data.type] = data.value;
        this.setState({ mail: mail, titleError: "", mailError: "" });
    };

    handleFileChange = (e) => {
        e.preventDefault();
        this.setState({ inputfileValue: e.target.value });
        const file = e.target.files[0];
        if (["application/pdf"].indexOf(file.type) > -1) {
            CommonUtil.zipFile(file, null, this.callbackUpload);
        }

        this.setState({ inputfileValue: "", fileName: file.name, titleError: "" });
    };

    callbackUpload = (content) => {
        let { files, fileName } = this.state;
        files = [];
        files.push({ name: fileName, content: content });
        this.setState({ files: files });
    };

    sendEmail = () => {
        const { mail, files } = this.state;
        if (this.valaidateMail()) {
            this.props.sendData(mail, files[0]);
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
                    <div className="row">
                        <div className="col-10">
                            <h3>Share as attachment to this email</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
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
                    <div className="row">
                        <div className="col-12">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button onClick={this.sendEmail.bind(this)} className="next-btn">
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShareEmailModal;
