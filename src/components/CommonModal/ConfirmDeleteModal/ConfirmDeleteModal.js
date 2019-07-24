import React from "react";
import "./ConfirmDeleteModal.scss";
import validation from "../../../util/validations";
import CommonUtil from "../../../util/commonUtil";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

class ConfirmDeleteModal extends React.Component {
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
        if (this.props.content) {
            html2canvas(this.props.content).then((canvas) => {
                this.addFile(canvas);
                // document.querySelector('body').appendChild(
                //     canvas
                // )
            });
        }
    }

    addFile = (canvas) => {
        let pdf = new jsPDF("p", "mm");
        let imgData = canvas.toDataURL({ format: "jpeg", quality: 0.2 });
        let imgWidth = 210;
        let pageHeight = 295;
        let imgHeight = canvas.height * (imgWidth / canvas.width);
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
            heightLeft -= pageHeight;
        }
        let file = pdf.output("blob");
        // pdf.save('sample.pdf');
        if (["application/pdf"].indexOf(file.type) > -1) {
            CommonUtil.zipFile(file, null, this.callbackUpload);
            this.setState({ inputfileValue: "", fileName: "Simulator", titleError: "" });
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
        return true;
    };

    render() {
        //const { mail, mailError } = this.state;
        const { handleDeleteDocs } = this.props;
        return (
            <div className="confirmdelete-modal">
                <div className="confirmdelete-modal__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Delete Confirmation</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>
                <div className="confirmdelete-modal__content">
                    <div className="confirmdelete-modal__content__box">
                        <div className="row">
                            <div className="col-12 modallabel">Are you sure you want to remove this items?</div>
                        </div>
                    </div>
                </div>

                <div className="confirmdelete-modal__footer">
                    <div className="row">
                        <div className="col-12">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button onClick={handleDeleteDocs} className="next-btn">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmDeleteModal;
