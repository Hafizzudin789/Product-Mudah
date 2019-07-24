import React from "react";
import "./ManageTopProducts.scss";
import { cloneDeep } from "lodash";

class ManageTopProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topProducts: [],
        };
    }

    componentDidMount() {
        const { data } = cloneDeep(this.props) || [];
        const processedMap = data.map((e) =>
            Object.assign(
                {},
                {
                    ...e,
                },
            ),
        );
        this.setState({
            topProducts: processedMap,
        });
    }

    handleToggle = () => {
        this.props.toggle();
    };

    handleUncheckProduct = (id) => {
        const { topProducts } = cloneDeep(this.state);
        const deletedProduct = topProducts.map((e) => {
            return {
                ...e,
                delete: e.delete ? e.delete : id === e.id,
            };
        });
        this.setState({
            topProducts: deletedProduct,
        });
    };

    render() {
        const { handleDelete } = this.props;
        const { topProducts } = cloneDeep(this.state);
        const filteredProduct = topProducts.filter((e) => !e.delete);
        const renderList =
            (filteredProduct &&
                filteredProduct.length &&
                filteredProduct.map((e, i) => {
                    return (
                        <div key={Math.random()} className="row no-gutters">
                            <div className="col-1" />
                            <div className="col-2 content-col">{i + 1}</div>
                            <div className="col-7 content-col">{e.productName}</div>
                            <div className="col-1 text-center content-col">
                                <img onClick={() => this.handleUncheckProduct(e.id)} src={require("assets/icons/delete-red.svg")} />
                            </div>
                            <div className="col-1" />
                        </div>
                    );
                })) ||
            false;
        return (
            <div className="top-product">
                <div className="top-product__header">
                    <div className="row">
                        <div className="col-10">
                            <h3>Manage Top List</h3>
                        </div>
                        <div className="col-2">
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={this.handleToggle} />
                        </div>
                    </div>
                </div>
                <div className="top-product__content">
                    <div className="table_view">
                        <div className="row no-gutters heading-row">
                            <div className="col-1" />
                            <div className="col-2">No.</div>
                            <div className="col-7">Products Selected</div>
                            <div className="col-1">Action</div>
                            <div className="col-1" />
                        </div>
                        {renderList}
                    </div>
                </div>

                <div className="top-product__footer">
                    <div className="row">
                        <div className="col-12">
                            <span className="cancel-btn" onClick={this.handleToggle}>
                                Cancel
                            </span>
                            <button onClick={() => handleDelete(topProducts)} className="next-btn">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageTopProducts;
