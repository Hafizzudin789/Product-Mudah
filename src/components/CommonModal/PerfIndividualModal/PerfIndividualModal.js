import React from "react";
import "./PerfIndividualModal.scss";
import { Link } from "react-router";
import Dropdown from "../../../components/Dropdown";
import CommonUtil from "../../../util/commonUtil";

class PerfIndividualModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: "All",
        };
    }

    componentDidMount() {}

    getRegion = () => {
        const { region, user } = this.props;
        return region && Object.keys(region).length > 0 ? region : user.region;
    };

    getTeam = () => {
        const { team, user } = this.props;
        return team && Object.keys(team).length > 0 ? team : user.team;
    };

    handleToggle = () => {
        this.props.toggle();
    };

    handleRequestRegions = () => {
        this.props.getPerformanceInsightRanking(this.props.metric, undefined, undefined, "FULL VIEW");
    };

    handleRequestTeams = () => {
        this.props.getPerformanceInsightRanking(this.props.metric, this.getRegion().id);
    };

    handleFilterSalesPersons = (select) => {
        this.setState({ filter: select.value });
    };

    render() {
        const { filter } = this.state;
        const { salesPersons } = this.props;
        const region = this.getRegion();
        const team = this.getTeam();

        const dropdownData = [
            {
                name: "All",
                value: "All",
            },
        ];

        const roleNames = [];
        for (const item of salesPersons) {
            if (!roleNames.includes(item.roleName)) {
                roleNames.push(item.roleName);
            }
        }
        for (const item of roleNames) {
            if (!dropdownData.includes(item)) {
                dropdownData.push({
                    name: item,
                    value: item,
                });
            }
        }

        const filteredList = filter === "All" ? salesPersons : salesPersons.filter((item) => item.roleName === filter);
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
            <div className="perfindividual-modal">
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
                            <Link onClick={this.handleRequestTeams} tabIndex={1}>{ region.name }</Link>
                            /
                            <Link className="current" tabIndex={2}>{team.name}</Link>
                        </div>
                        <div className="col-4">
                            <Dropdown
                                data={dropdownData}
                                title="View By"
                                name="viewby"
                                defaultValue="VIEW BY"
                                value={filter}
                                handleSelect={this.handleFilterSalesPersons}
                                withoutSpan
                            />
                        </div>
                    </div>
                </div>
                
                <div className="perfindividual-modal__content">
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
                            filteredList.map((item, index) => {
                                let colorCode = (item.percent > 0) ? "green" : "";
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
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

export default PerfIndividualModal;
