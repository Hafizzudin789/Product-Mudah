import React from "react";
import "./ShareProductModal.scss";
import InputText from "../../InputText";
import CommonUtil from "../../../util/commonUtil";
import html2canvas from "html2canvas";
import _ from "lodash";
import commonUtil from "../../../util/commonUtil";

class ShareProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: {
                email: "",
                title: props.name,
            },
            files: [
                {
                    name: "",
                    content: "",
                },
            ],
            size: 0,
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
        let mail = _.cloneDeep(this.state.mail);
        mail[data.type] = data.value;
        this.setState({ mail: mail, mailError: "" });
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
        if (!mail.email) {
            this.setState({ mailError: "Please enter the recipient's email address" });
            return false;
        }
        return true;
    };

    render() {
        let { mail, size, mailError, fileName, files } = this.state;
        const fileRenderer =
            files &&
            files.map(() => {
                return (
                    <div key={Math.random()} className="attachedfile">
                        {fileName || ""}
                        <span> {(size && `(${CommonUtil.formatBytes(size, 0)})`) || false}</span>
                    </div>
                );
            });
        return (
            <div className="shareproduct-modal">
                <div className="shareproduct-modal__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Share to</h3>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <img src={require("assets/icons/closed-modal-black.svg")} style={{'margin':0,'width': 15, 'height':15}} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>
                <div className="shareproduct-modal__content">
                    <div className="shareproduct-modal__content__box">
                        <div className="row">
                            <div className="col-12 modallabel">To</div>
                            <div className="col-12">
                                <InputText
                                    placeholder="Enter Email Address"
                                    directErrorMsg={mailError}
                                    value={mail.email}
                                    name="email"
                                    handleChange={this.inputChange}
                                    withoutSpan
                                />
                            </div>
                            <div className="col-12 modallabel">Subject</div>
                            <div className="col-12">
                                <InputText
                                    placeholder="Accepted Bill-i"
                                    directErrorMsg={mailError}
                                    value={mail.title}
                                    name="title"
                                    handleChange={this.inputChange}
                                    withoutSpan
                                />
                            </div>
                            <div className="col-12 modallabel">Attached File</div>
                            <div className="col-12">{fileRenderer}</div>
                        </div>
                    </div>
                </div>

                <div className="shareproduct-modal__footer">
                    <div className="row">
                        <div className="col-12">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button onClick={this.sendEmail} className="next-btn">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShareProductModal;
