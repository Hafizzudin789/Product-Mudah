import _ from "lodash";
import React from "react";
import "./SmeProducts.scss";
import Checkbox from "../../Checkbox";
import SearchBar from "../../SearchBar";

const ProductWrapper = ({ data, handleCheck }) => {
    return (
        <div className="row">
            <div className="col-1">
                <Checkbox handleCheck={handleCheck} isChecked={data.isChecked} data={data} />
            </div>
            <div className="col-11">
                <label>{data.productName}</label>
            </div>
        </div>
    );
};

class SmeProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            smeProducts: [],
            textSearch: "",
        };
        this.textFilter = "";
    }

    componentDidMount() {
        this.setState({
            smeProducts: _.cloneDeep(this.props.smeProducts).filter((e) => e.selected == false),
        });
    }

    handleCheck = (data) => {
        let smeProducts = this.state.smeProducts;
        _.forEach(smeProducts, (product) => {
            if (product.id === data.id) {
                if (!product.isChecked) {
                    product.isChecked = true;
                    product.type = product.productType;
                    product.product = product;
                } else {
                    product.isChecked = !product.isChecked;
                }
            }
        });
        this.setState({
            smeProducts: smeProducts,
        });
    };

    handleSearch = (data) => {
        this.setState({
            textSearch: !data.isReset ? this.textFilter : "",
        });
    };

    handleChange = (data) => {
        this.textFilter = data;
    };

    checkProduct = (product) => {
        if (product.productName) {
            return product.productName.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        } else if (product.name) {
            return product.name.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        }
    };

    render() {
        const { handleSave, toggle, title } = this.props;
        const { smeProducts } = this.state;
        const content = _.filter(smeProducts, (product) => this.checkProduct(product)).map((product, index) => (
            <ProductWrapper data={product} key={index} handleCheck={this.handleCheck} />
        ));

        return (
            <div className="sme-products">
                <div className="sme-products__header">
                    <h3>
                        {title ? title : "SME Products"}
                        <span>
                            <img src={require("assets/icons/close.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="sme-products__content">
                    <div className="row no-gutters sme-products__content__search">
                        <SearchBar
                            placeholder="Search"
                            hideButton={true}
                            hideShadow={true}
                            handleSearch={this.handleSearch}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className="sme-products__content__container">{content}</div>
                </div>
                <div className="sme-products__footer" onClick={handleSave.bind(this, smeProducts)}>
                    Save Selection
                </div>
            </div>
        );
    }
}

export default SmeProducts;
