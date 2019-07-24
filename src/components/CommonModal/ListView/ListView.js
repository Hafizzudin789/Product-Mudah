import _ from "lodash";
import React from "react";
import "./ListView.scss";
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

class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            textSearch: "",
            all: {
                delete: false,
                id: "-1",
                isChecked: false,
                isExist: true,
                name: "All",
                type: "",
            },
        };

        this.textFilter = "";
    }

    componentDidMount() {
        let all = this.state.all;
        let list = _.cloneDeep(this.props.list) || [];
        all.isChecked = this.isCheckedAllItem(list);
        list.unshift(all);
        this.setState({ list: list, all: all });
    }

    isCheckedAllItem(list) {
        if (!list || list.length == 0) {
            return false;
        }
        const filterList = list.filter((item) => !item.isChecked && item.id !== "-1");
        return filterList.length == 0 ? true : false;
    }

    handleCheck = (data) => {
        let list = this.state.list;
        if (data.id === "-1") {
            _.forEach(list, (entry) => {
                entry.isChecked = entry.id === "-1" ? !entry.isChecked : data.isChecked;
            });
        } else {
            _.forEach(list, (entry) => {
                if (entry.id === data.id) {
                    entry.isChecked = !entry.isChecked;
                }
            });
            list[0].isChecked = this.isCheckedAllItem(list);
        }

        this.setState({
            list: list,
        });
    };

    //TODO temp fix close btn
    handleToggle = () => {
        this.setState({
            list: this.state.list.map((item) => delete item.isChecked),
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

    checkCrossSellingProduct = (entry) => {
        if (entry.productName) {
            return entry.productName.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        } else {
            return entry.name.toLowerCase().indexOf(this.state.textSearch.toLowerCase()) > -1;
        }
    };

    render() {
        const { list } = this.state;
        const { handleSelect, title, selectBtnName, cancelBtnName, searchTextName } = this.props;
        const filterList = _.filter(list, (entry) => this.checkCrossSellingProduct(entry) || entry.id == "-1");
        const content = filterList.map((entry, index) => <ProductWrapper data={entry} key={index} handleCheck={this.handleCheck} />);

        return (
            <div className="list-view">
                <div className="list-view__header">
                    <h3>
                        {title ? title : "List"}
                        <span>
                            <img src={require("assets/icons/close.svg")} onClick={this.handleToggle} />
                        </span>
                    </h3>
                </div>
                <div className="list-view__content">
                    <div className="row no-gutters cross-selling-products__content__search">
                        <SearchBar
                            placeholder={searchTextName}
                            hideButton={true}
                            hideShadow={true}
                            handleSearch={this.handleSearch}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className="list-view__content__container">{content}</div>
                </div>
                {cancelBtnName && (
                    <div className="list-view__footer" onClick={this.handleToggle}>
                        {cancelBtnName}
                    </div>
                )}
                <div className="list-view__footer" onClick={handleSelect.bind(this, filterList)}>
                    {selectBtnName}
                </div>
            </div>
        );
    }
}

export default ListView;
