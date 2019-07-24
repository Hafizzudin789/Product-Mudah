import React from "react";
import "./ShareEmailModalSimulator.scss";
import InputText from "../../InputText";
import validation from "../../../util/validations";
import CommonUtil from "../../../util/commonUtil";
import html2canvas from "html2canvas";
import commonUtil from "../../../util/commonUtil";

class ShareEmailModalSimulator extends React.Component {
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
        if (this.validateMail()) {
            let data = {
                customerEmail: mail.emailId,
                title: mail.title,
                fileName: this.props.name,
                type: "pdf",
                simulatorImage: files[0] ? files[0].content : "",
            };
            this.props.sendData(data);
            this.handleToggle();
        }
    };

    validateMail = () => {
        const { mail } = this.state;
        if (!mail.emailId) {
            this.setState({ mailError: "Please enter the recipient's email address" });
            return false;
        }
        if (!validation.checkEmail(mail.emailId)) {
            this.setState({ mailError: "Email in invalid format" });
            return false;
        }

        return true;
    };

    render() {
        const { mail, mailError } = this.state;
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

export default ShareEmailModalSimulator;
