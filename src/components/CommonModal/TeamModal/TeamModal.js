import React from "react";
import "./TeamModal.scss";
import { Link } from "react-router";
import CommonUtil from "../../../util/commonUtil";

class TeamModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    getRegion = () => {
        const { region, user } = this.props;
        return region && Object.keys(region).length > 0 ? region : user.region;
    };

    handleToggle = () => {
        this.props.toggle();
    };

    handleRequestRegions = () => {
        this.props.getPerformanceInsightRanking(this.props.metric, undefined, undefined, "FULL VIEW");
    };

    handleRequestSalesPersons = (team) => {
        this.props.handleSelect(team);

        const { id } = team;
        this.props.getPerformanceInsightRanking(this.props.metric, this.getRegion().id, id);
    };

    render() {
        const { teams } = this.props;
        const region = this.getRegion();
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
            <div className="team-modal">
                <div className="modal-header-new">
                    <div className="row">
                        <div className="col modal-title-new d-flex justify-content-between">
                            <h3>{headingText}</h3>
                            <div className="modal-close-btn">
                                <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-border-grey"></div>
                    <div className="row">
                        <div className="col modal-breadcrumb-new">
                            <Link onClick={this.handleRequestRegions} tabIndex={0}>Region</Link>
                            /
                            <Link className="current" tabIndex={1}>{region.name}</Link>
                        </div>
                    </div>
                </div>
                <div className="team-modal__content">
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
                        {
                            teams.map((item, index) => {
                                const handleClick = () => {
                                    this.handleRequestSalesPersons(item);
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
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TeamModal;
