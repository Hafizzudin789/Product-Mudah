import React from "react";
import SAChart from "./SAChart";
import "./PDSalesAcceptance.scss";

class PDSalesAcceptance extends React.Component {
    constructor(props) {
        super(props);
    }

    handleToggle = () => {
        this.props.toggle();
    };

    render() {
        const { chartData, title } = this.props;
        return (
            <div className="pd-sales">
                <div className="pd-sales__header">
                    <h3>
                        {title}
                        <span>
                            <img src={require("assets/icons/close.svg")} className="pd-sales__header--close" onClick={this.handleToggle} />
                        </span>
                    </h3>
                </div>
                <div className="pd-sales__content">
                    <SAChart data={chartData} />
                </div>
            </div>
        );
    }
}

export default PDSalesAcceptance;
