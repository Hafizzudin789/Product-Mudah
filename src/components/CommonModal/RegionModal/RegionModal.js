import React from "react";
import "./RegionModal.scss";
import { Link } from "react-router";
import CommonUtil from "../../../util/commonUtil";

class RegionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    handleToggle = () => {
        this.props.toggle();
    };

    handleRequestTeams = (region) => {
        this.props.handleSelect(region);

        const { id } = region;
        this.props.getPerformanceInsightRanking(this.props.metric, id);
    };

    render() {
        const { regions } = this.props;
        let headingText = "Sales Performance Details";
        switch (this.props.metric) {
            case "Asset growth":
                headingText = "Loan Growth Details";
                break;
            case "deposit growth":
                headingText = "Deposit Growth Details";
                break;
        
            default:
                break;
        }
        return (
            <div className="region-modal">
                <div className="modal-header-new">
                    <div className="row">
                        <div className="col modal-title-new d-flex justify-content-between">
                            <h3>{headingText}</h3>
                            <div className="modal-close-btn">
                                <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="region-modal__content">
                    <table className="modal-table">
                        <thead>
                            <tr className="modal-table-heading">
                                <th>Rank</th>
                                <th>Region</th>
                                <th>Actual <span className="font-normal">(MYR)</span></th>
                                <th>Budget <span className="font-normal">(MYR)</span></th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                        {regions.map((item, index) => {
                            const handleClick = () => {
                                this.handleRequestTeams(item);
                            };
                            let colorCode = (item.percent > 0) ? "green" : "";
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link onClick={handleClick} tabIndex={index}>{item.name}</Link>
                                    </td>
                                    <td>{CommonUtil.formatCurrencyValue(item.actual)}</td>
                                    <td>{CommonUtil.formatCurrencyValue(item.budget)}</td>
                                    <td className={colorCode}>{CommonUtil.formatCurrencyValue(item.percent)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RegionModal;
