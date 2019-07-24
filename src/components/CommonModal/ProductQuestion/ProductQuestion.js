import React from "react";

import "./ProductQuestion.scss";
import Dropdown from "../../Dropdown";
import InputComponent from "../../InputComponent";

class ProductQuestion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="product-question">
                <div className="product-question__header">
                    <h3>
                        Product Recommendation Questions
                        <span>
                            <img src={require("assets/icons/close.svg")} />
                        </span>
                    </h3>
                </div>
                <div className="product-question__content">
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">What industry are you in?</div>
                        <div className="col-6">
                            <Dropdown title="" name="retail" defaultValue="Retail" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">What is your main banking need?</div>
                        <div className="col-6">
                            <Dropdown title="" name="wc" defaultValue="Working Capital" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">
                            Have you had other facilities before (in RHB or other banks)?
                        </div>
                        <div className="col-6">
                            <div className="row no-gutters justify-content-between">
                                <div className="col product-question__content__radio">
                                    <input type="radio" name="radioBtn1" id="radio1a" />
                                    <label htmlFor="radio1a">
                                        <span> Yes</span>
                                    </label>
                                </div>
                                <div className="col product-question__content__radio">
                                    <input type="radio" name="radioBtn1" id="radio1b" />
                                    <label htmlFor="radio1b">
                                        <span> No</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">What is your annual turnover? (in RM)</div>
                        <div className="col-6">
                            <InputComponent />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">Do you transact in foreign currencies?</div>
                        <div className="col-6">
                            <div className="row no-gutters justify-content-between">
                                <div className="col product-question__content__radio">
                                    <input type="radio" name="radioBtn2" id="radio2a" />
                                    <label htmlFor="radio2a">
                                        <span> Yes</span>
                                    </label>
                                </div>
                                <div className="col product-question__content__radio">
                                    <input type="radio" name="radioBtn2" id="radio2b" />
                                    <label htmlFor="radio2b">
                                        <span> No</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 product-question__content__label-text">How many employees do you have?</div>
                        <div className="col-6">
                            <InputComponent />
                        </div>
                    </div>
                </div>
                <div className="product-question__footer">
                    <button className="product-question__footer--btn btn">Show recommended products</button>
                </div>
            </div>
        );
    }
}

export default ProductQuestion;
