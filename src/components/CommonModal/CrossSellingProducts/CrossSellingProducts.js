import _ from "lodash";
import React from "react";
import "./CrossSellingProducts.scss";
import Checkbox from "../../Checkbox";
import SearchBar from "../../SearchBar";

const ProductWrapper = ({ data, handleCheck }) => {
    return (
        <div className="row">
            <div className="col-1">
                <Checkbox handleCheck={handleCheck} isChecked={data.isChecked} data={data} />
            </div>
            <div className="col-11">
                <label>{data.name}</label>
            </div>
        </div>
    );
};

class CrossSellingProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            crossSellingProducts: [],
            textSearch: "",
            all: {
                delete: false,
                id: "-1",
                isChecked: false,
                isExist: true,
                name: "All",
                type: "Industry",
            },
        };

        this.textFilter = "";
    }

    componentDidMount() {
        let all = this.state.all;
        let crossSellingProducts = _.cloneDeep(this.props.crossSellingProducts);
        all.isChecked = this.isCheckedAllItem(crossSellingProducts);

        const isAllItemExist = crossSellingProducts && crossSellingProducts.find((item) => item.id === "-1");
        if (!isAllItemExist) crossSellingProducts.unshift(all);

        this.setState({ crossSellingProducts: crossSellingProducts, all: all });
    }

    isCheckedAllItem(list) {
        const filterList = list.filter((item) => !item.isChecked && item.id !== "-1");
        return filterList.length == 0 ? true : false;
    }

    handleCheck = (data) => {
        let crossSellingProducts = this.state.crossSellingProducts;
        if (data.id === "-1") {
            _.forEach(crossSellingProducts, (product) => {
                product.isChecked = product.id === "-1" ? !product.isChecked : data.isChecked;
            });
        } else {
            _.forEach(crossSellingProducts, (product) => {
                if (product.id === data.id) {
                    product.isChecked = !product.isChecked;
                }
            });
            crossSellingProducts[0].isChecked = this.isCheckedAllItem(crossSellingProducts);
        }

        this.setState({
            crossSellingProducts: crossSellingProducts,
        });
    };

    //TODO temp fix close btn
    handleToggle = () => {
        this.setState({
            crossSellingProducts: this.state.crossSellingProducts.map((item) => delete item.isChecked),
        });

        this.props.toggle();
    };

    handleSearch = (data) => {
        this.setState({
            textSearch: !data.isReset ? this.textFilter : "",
        });
    };

    handleChange = (data) => {
        this.textFilter = data;
    };

    checkCrossSellingProduct = (product) => {
        if (product.productName) {
            return product.productName.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        } else {
            return product.name.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        }
    };

    render() {
        const { crossSellingProducts } = this.state;
        const { handleSave, title } = this.props;
        const filterList = _.filter(crossSellingProducts, (product) => this.checkCrossSellingProduct(product) || product.id == "-1");
        const content = filterList.map((product, index) => <ProductWrapper data={product} key={index} handleCheck={this.handleCheck} />);

        return (
            <div className="cross-selling-products">
                <div className="cross-selling-products__header">
                    <h3>
                        {title ? title : "Cross Selling Products"}
                        <span>
                            <img src={require("assets/icons/close.svg")} onClick={this.handleToggle} />
                        </span>
                    </h3>
                </div>
                <div className="cross-selling-products__content">
                    <div className="row no-gutters cross-selling-products__content__search">
                        <SearchBar
                            placeholder="Search"
                            hideButton={true}
                            hideShadow={true}
                            handleSearch={this.handleSearch}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className="cross-selling-products__content__container">{content}</div>
                </div>
                <div className="cross-selling-products__footer" onClick={handleSave.bind(this, filterList)}>
                    Save Selection
                </div>
            </div>
        );
    }
}

export default CrossSellingProducts;
