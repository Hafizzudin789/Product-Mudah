import React from "react";

import "./CommonError.scss";

class CommonError extends React.Component {
    constructor(props) {
        super(props);
    }

    handleToggle = () => {
        this.props.handleToggle();
    };

    render() {
        const { title, msg } = this.props;

        return (
            <div className="simulatorError">
                <div className="simulatorError__header modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="simulatorError__body modal-body">
                    <div className="row">
                        <div className="col-2 text-right">
                            <img className="simulatorError__icon" src={require("assets/icons/warning.svg")} />
                        </div>
                        <div className="col-10">
                            <p>{msg}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 simulatorError__footer">
                            <button type="button" className="simulatorError__button" onClick={this.handleToggle}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonError;
