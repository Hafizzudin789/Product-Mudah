import React, { Component } from "react";
import "./LeadSubmissionModal.scss";
import InputNumber from "../../../components/InputNumber";
import _ from "lodash";

const ItemEstimated = ({ data, handleInput, handleDelete }) => {
    return (
        <div className="row item-estimated">
            <div className="col-7 flex align-center">
                <p className="content-left">{data.product.productName}</p>
            </div>
            <div className="col-1"></div>
            <div className="col-3 input-number">
                <InputNumber
                    // name will get property index REMEMBER!
                    name={data.id}
                    placeholder="Estimated Value..."
                    value={data.estimatedAssets ? data.estimatedAssets : 0}
                    handleChange={handleInput}
                    withoutSpan={true}
                    className="no-margin no-padding no-border"
                />
            </div>

            <div className="col-1 flex align-center icon-delete">
                <img onClick={handleDelete.bind(this, data.id)} src={require("assets/icons/close.svg")} />
            </div>
            <hr></hr>
        </div>
    );
};

export default class LeadSubmissionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            leadId: "",
        };
    }

    componentDidMount = () => {
        const { productsSelected, leadId } = this.props;
        let mutate = _.cloneDeep(productsSelected);
        mutate.map((e) => {
            e.estimatedAssets ? e.estimatedAssets : (e.estimatedAssets = 0);
            return e;
        });
        this.setState({
            products: mutate,
            leadId: leadId,
        });
    };

    handleToggle = () => {
        this.props.toggle();
    };

    handleInputChange = (e) => {
        let mutate = _.cloneDeep(this.state.products);
        mutate.map((el) => {
            el.id === e.type ? (el.estimatedAssets = e.value) : [];
        });

        this.setState({
            products: mutate,
        });
    };

    handleDeleteProduct = (data) => {
        let mutate = [];
        mutate = _.cloneDeep(this.state.products);

        // check return id from deleted checkbox in modal
        // exclude to set false when sending to backend
        mutate.map((e) => {
            if (e.exclude) {
                return e;
            } else if (e.id === data) {
                e.isChecked = false;
                e.exclude = true;
            } else e.exclude = false;
            // e.id === data ? e.isChecked = false : []
            return e;
        });

        this.setState({
            products: mutate,
        });

        if (mutate.filter((e) => e.isChecked === true).length == 0) this.props.toggle();
    };

    render() {
        const { handleSaveSubmission } = this.props;
        const { products } = this.state;
        const textHeader = this.props.text ? this.props.text : false;
        const content = products
            .filter((e) => {
                // first filter element is checked
                return e.isChecked === true;
            })
            .map((e, index) => (
                // then loop throught checked item and render them
                <ItemEstimated
                    key={index}
                    data={e}
                    handleInput={this.handleInputChange}
                    index={index}
                    handleDelete={this.handleDeleteProduct}
                />
            ));
        return (
            <div className="value-confirm">
                <div className="value-confirm__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Move To {textHeader}</h3>
                        </div>
                        <div className="col-2 rel">
                            <img className="close-modal" src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>

                <div className="value-confirm__content">
                    <h1 className="text-confirm">
                        Before you can move {this.state.leadId} lead to <b>{textHeader}</b> you will need to update these products
                    </h1>
                    <div className="wrapper-item-submission">
                        <div className="row table-submission-header">
                            <div className="col-7">
                                <h3>Products Requested</h3>
                            </div>

                            <div className="col-1"></div>

                            <div className="col-3">
                                <h3>Submission Value</h3>
                            </div>

                            <div className="col-1"></div>
                        </div>
                        <div className="item-group">{content}</div>
                    </div>
                </div>
                <div className="value-confirm__footer">
                    <div className="row">
                        <div className="col-5" />
                        <div className="col-7 just-end flex">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <span className="next-btn" onClick={handleSaveSubmission.bind(this, this.state.products)}>
                                Confirm
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
