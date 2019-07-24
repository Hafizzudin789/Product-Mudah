import React from "react";

import "./ProductEligibility.scss";
import Dropdown from "../../Dropdown";

class ProductEligibility extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="product-eligibility">
                <div className="product-eligibility__header">
                    <h3>
                        Product Eligibility Questions
                        <span>
                            <img src={require("assets/icons/close.svg")} />
                        </span>
                    </h3>
                </div>
                <div className="product-eligibility__content">
                    <div className="row">
                        <div className="col-6">
                            <label>Collateral Type</label>
                            <Dropdown className="dropdown" title="" name="fd" defaultValue="FD" />
                        </div>
                        <div className="col-6">
                            <label>Net Profit Before Tax</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>Is facility OD or MTL</label>
                            <Dropdown className="dropdown" title="" name="yes" defaultValue="Yes" />
                        </div>
                        <div className="col-6">
                            <label>Depreciation & Amortization</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>Business Term Loan Tenor</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                        <div className="col-6">
                            <label>Interest Expense</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>Turnover</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                        <div className="col-6">
                            <label>Current Maturity - All Bank</label>
                            <input type="text" className="product-eligibility__content__textbox" />
                        </div>
                    </div>
                    <div className="row last">
                        <div className="col-6">
                            <label>Annualized Credit Turnover</label>
                            <input type="text" className="product-eligibility__content__textbox product-eligibility__content__no-border" />
                        </div>
                        <div className="col-6">
                            <label>Current Maturity - HP / Lease Creditors / Others</label>
                            <input type="text" className="product-eligibility__content__textbox product-eligibility__content__no-border" />
                        </div>
                    </div>
                </div>
                <div className="product-eligibility__footer">Continue</div>
            </div>
        );
    }
}

export default ProductEligibility;
