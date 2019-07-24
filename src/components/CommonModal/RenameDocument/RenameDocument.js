import React from "react";
import "./RenameDocument.scss";
import InputComponent from "../../InputComponent";

class RenameDocument extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
    }

    componentDidMount() {
        this.setState({
            name: this.props.data.name,
        });
    }

    //TODO temp fix close btn
    handleToggle = () => {
        this.props.toggle();
    };

    handleConfirm = () => {
        const { toggle, updateDocument, data, closeThreeDots } = this.props;
        let dataModified = { ...data };
        dataModified.name = this.state.name;
        toggle();
        closeThreeDots();
        updateDocument({ data: dataModified, isRenameName: true });
    };

    handleChangeName = (data) => {
        this.setState({
            name: data.value,
        });
    };

    render() {
        const { name } = this.state;
        return (
            <div className="rename-document">
                <div className="rename-document__header">
                    <h3>Rename document</h3>
                </div>
                <div className="rename-document__content">
                    <div className="row">
                        <div className="col-2" />
                        <div className="col-1">
                            <span>
                                <img src={require("assets/icons/warning.svg")} />
                            </span>
                        </div>
                        <div className="col-8 rename-document__content__label-text">Please enter a new name for this Document</div>
                        <div className="col-1" />
                    </div>
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-8">
                            <InputComponent value={name} handleChange={this.handleChangeName} />
                        </div>
                        <div className="col-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-9">
                            <button
                                className={`btn ${
                                    name && name.length > 0 ? "rename-document__content__green-btn" : "rename-document__content__grey-btn"
                                }`}
                                onClick={this.handleConfirm}>
                                Confirm
                            </button>
                            <button className="btn rename-document__content__default-btn" onClick={this.handleToggle}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RenameDocument;
