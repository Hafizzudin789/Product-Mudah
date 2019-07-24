import React from "react";
import "./ValueConfirmModal.scss";
import InputComponent from "../../InputComponent";

class ValueConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {}
    handleToggle = () => {
        this.props.toggle();
    };
    render() {
        const { handleClick, handleInputChange, name, value, labelBottom } = this.props;
        let field = {
            name: "",
            value: "",
        };
        if (this.props.changeKey === "EV") {
            field.name = "Estimated Value";
            field.value = "Enter estimated value";
        } else if (this.props.changeKey === "SA") {
            field.name = "Submitted Amount";
            field.value = "Enter submitted amount";
        } else if (this.props.changeKey === "APV") {
            field.name = "Approved Value";
            field.value = "Enter approved value";
        } else if (this.props.changeKey === "ACV") {
            field.name = "Accepted Value";
            field.value = "Enter accepted value";
        }

        return (
            <div className="value-confirm">
                <div className="value-confirm__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Value Confirmation</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>

                <div className="value-confirm__content">
                    <div className="row form-row">
                        <div className="col-12">
                            <div className="form-label">{field.name}</div>
                        </div>
                        <div className="col-12">
                            <InputComponent
                                className="autoinput"
                                placeholder={field.value}
                                isFocus={false}
                                name={name}
                                value={value}
                                handleChange={handleInputChange}
                            />
                        </div>
                        <div className="col-12 label-bottom">{labelBottom}</div>
                    </div>
                </div>
                <div className="value-confirm__footer">
                    <div className="row">
                        <div className="col-5" />
                        <div className="col-7">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <span className="next-btn" onClick={handleClick}>
                                Submit
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ValueConfirmModal;
