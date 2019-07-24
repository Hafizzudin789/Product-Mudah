import React from "react";
import "./RecommandedQuestion.scss";
import Dropdown from "../../Dropdown";
import Checkbox from "../../Checkbox";
const retailData = [
    "Get a loan for Investments",
    "Get a loan for Working Capital",
    "Help facilitate my trade transactions",
    "Finance my distributors",
    "Invest surplus funds",
    "Daily cash management",
];

class RecommandedQuestion extends React.Component {
    constructor(props) {
        super(props);
    }
    handleCheck = (data) => {
        let userPrivileges = this.state.userPrivileges;
        userPrivileges.forEach((privilege) => {
            if (privilege.id === data.id) {
                if (!privilege.isChecked) {
                    privilege.isChecked = true;
                } else {
                    privilege.isChecked = !privilege.isChecked;
                }
            }
        });

        this.setState({
            userPrivileges: userPrivileges,
        });
    };
    render() {
        return (
            <div className="recommanded-question">
                <div className="recommanded-question__header">
                    <h3>
                        Product Recommendation Questions
                        <span>
                            <img src={require("assets/icons/close.svg")} />
                        </span>
                    </h3>
                </div>
                <div className="recommanded-question__content">
                    <div className="row">
                        <div className="col-7">This is a question</div>
                        <div className="col-5">
                            <div className="row justify-content-between">
                                <div className="col recommanded-question__content__radio">
                                    <input type="radio" name="radioBtn1" id="radio1a" />
                                    <label htmlFor="radio1a">
                                        <span> Yes</span>
                                    </label>
                                </div>
                                <div className="col recommanded-question__content__radio">
                                    <input type="radio" name="radioBtn1" id="radio1b" />
                                    <label htmlFor="radio1b">
                                        <span> No</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-7">How many Employees do you have?</div>
                        <div className="col-5">
                            <Dropdown title="" name="employees" defaultValue="More than 5" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-7">What best describes your line of business?</div>
                        <div className="col-5">
                            <Dropdown title="" name="retailData" defaultValue="Retail" data={retailData} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-7">What is your business need?</div>
                        <div className="col-5">
                            <Dropdown title="" name="wc" defaultValue="Get a loan for Working Capital" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-7">I need a loan for: (choose all that applies)</div>
                        <div className="col-5" />
                    </div>
                    <div className="row recommanded-question__content__checkbox">
                        <div className="col-6">
                            <Checkbox handleCheck={this.handleCheck} isChecked={false} /> <span>Daily Operations</span>
                        </div>
                        <div className="col-6">
                            <Checkbox handleCheck={this.handleCheck} isChecked={false} /> <span>Financing a Contract</span>
                        </div>
                    </div>
                </div>
                <div className="recommanded-question__footer">
                    <button className="recommanded-question__footer--btn btn">Generate product selection</button>
                </div>
            </div>
        );
    }
}
export default RecommandedQuestion;
