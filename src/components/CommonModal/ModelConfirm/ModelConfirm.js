import React from "react";
import PropTypes from "prop-types";
import "./ModelConfirm.scss";

class ModelConfirm extends React.Component {
    constructor(props) {
        super(props);
    }

    handleToggle = () => {
        this.props.toggle();
    };

    handleConfirm = () => {
        this.props.navigatePage();
    };

    render() {
        const { msg, title } = this.props;
        return (
            <div className="model_confirm">
                <div className="model_confirm__header">
                    <h2>
                        {title}
                        <span>
                            <img onClick={this.handleToggle} src={require("assets/icons/closed-modal-black.svg")} />
                        </span>
                    </h2>
                </div>
                <div className="model_confirm__content">{msg}</div>
                <div className="model_confirm__footer">
                    <button className="btn model_confirm__content__button-box__default-btn" onClick={this.handleToggle}>
                        Cancel
                    </button>
                    <button className="btn model_confirm__content__button-box__green-btn" onClick={this.handleConfirm}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}
ModelConfirm.propTypes = {
    msg: PropTypes.string,
    handleConfirm: PropTypes.func,
};

export default ModelConfirm;
