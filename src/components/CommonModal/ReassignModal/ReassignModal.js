import React from "react";
import "./ReassignModal.scss";
import InputComponent from "../../InputComponent";
import _ from "lodash";

const ListSalesPerson = ({ data, handleSelect, exclude = false }) => {
    const defaultPic = require("assets/img/avatar.jpg");
    const className = data.isSelected ? "row content-row selected" : "row content-row";
    if (exclude == data.name) return false;
    return (
        <div onClick={handleSelect.bind(this, data.id)} className={className}>
            <div className="col-2">
                <img src={_.isEmpty(data.profilePic) ? defaultPic : data.profilePic} width="32" height="32" />
            </div>
            <div className="col-5 name-style">{data.name}</div>
            <div className="col-5 place-style">
                {data.roleName} - {data.regionName}
            </div>
        </div>
    );
};

class ReassignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salesPerson: false,
            checkedItem: false,
            salesManager: false,
            searchCriteria: "",
            currentSalesPersonName: props.currentSalesPersonName ? props.currentSalesPersonName : false,
        };
    }

    // REACT LIFECYCLE--------------------------------

    componentWillMount() {
        this.setState({
            salesPerson: _.cloneDeep(this.props.salesPerson ? this.props.salesPerson : []),
            checkedItem: _.cloneDeep(this.props.checkedItem),
            salesManager: _.cloneDeep(this.props.salesManager ? this.props.salesManager : []),
            searchCriteria: "",
        });
    }

    componentWillUnmount() {
        this.setState({
            salesPerson: [],
            checkedItem: [],
            searchCriteria: "",
        });
    }

    // REACT LIFECYCLE--------------------------------

    handleSelectSalesPerson = (e) => {
        let mutate = _.cloneDeep(this.state.salesPerson).map((a) => {
            a.isSelected = false;
            a.id == e ? (a.isSelected = true) : [];
            return a;
        });
        // mutate[e].isSelected = true
        this.setState({
            salesPerson: mutate,
        });
    };

    handleSelectSalesManager = (e) => {
        let mutate = _.cloneDeep(this.state.salesManager).map((a) => {
            a.isSelected = false;
            a.id == e ? (a.isSelected = true) : [];
            return a;
        });
        // mutate[e].isSelected = true
        this.setState({
            salesManager: mutate,
        });
    };

    handleSelect = (e) => {
        this.state.salesManager.length ? this.handleSelectSalesManager(e) : this.handleSelectSalesPerson(e);
    };

    handleAssign = () => {
        const { handleAssignLeads } = this.props;
        const salesChecked = this.state.salesPerson.filter((e) => e.isSelected === true);

        const salesManager = this.state.salesManager.filter((e) => e.isSelected === true);

        let arr = {
            leads: this.state.checkedItem,
            salesPerson: salesChecked[0],
            salesManager: salesManager[0],
        };

        if (this.state.salesManager.length && _.isEmpty(arr.salesManager)) return false;
        else if (this.state.salesPerson.length && _.isEmpty(arr.salesPerson)) return false;
        else handleAssignLeads(arr);
    };

    handleInputChange = (data) => {
        this.setState({
            [data.type]: data.value,
        });
    };

    render() {
        const { toggle } = this.props;
        const { salesPerson, salesManager } = this.state;
        const filteredList = salesManager.length
            ? salesManager.filter((obj) => {
                  return Object.keys(obj).reduce((acc, curr) => {
                      return (
                          acc ||
                          obj[curr]
                              .toString()
                              .toLowerCase()
                              .includes(this.state.searchCriteria)
                      );
                  }, false);
              })
            : salesPerson.filter((obj) => {
                  return Object.keys(obj).reduce((acc, curr) => {
                      return (
                          acc ||
                          obj[curr]
                              .toString()
                              .toLowerCase()
                              .includes(this.state.searchCriteria)
                      );
                  }, false);
              });

        // check 3 character input by user, if more than or equal to 3, show the filtered person
        const list =
            this.state.searchCriteria.length >= 3
                ? filteredList.map((item, index) => (
                      <ListSalesPerson
                          data={item}
                          key={index}
                          index={index}
                          handleSelect={this.handleSelect}
                          exclude={this.state.currentSalesPersonName}
                      />
                  ))
                : salesManager.length
                ? salesManager.map((item, index) => (
                      <ListSalesPerson
                          data={item}
                          key={index}
                          index={index}
                          handleSelect={this.handleSelect}
                          //exclude = {this.state.currentSalesPersonName}
                      />
                  ))
                : salesPerson.map((item, index) => {
                      // this will filter current salesperson wont appear
                      // if (item.name != this.state.currentSalesPersonName)
                      return (
                          <ListSalesPerson
                              data={item}
                              key={index}
                              index={index}
                              handleSelect={this.handleSelect}
                              exclude={this.state.currentSalesPersonName}
                          />
                      );
                  });
        return (
            <div className="reassign-modal">
                <div className="reassign-header">
                    <h3>
                        Lead Reassignment
                        <span>
                            <img src={require("assets/icons/closed-modal-black.svg")} onClick={toggle} />
                        </span>
                    </h3>
                </div>
                <div className="reassign-header-notice">
                    {this.state.currentSalesPersonName ? (
                        <span>
                            You’re about to transfer {this.state.checkedItem.length} leads occupted by {this.state.currentSalesPersonName}
                        </span>
                    ) : (
                        <span>You’re about to transfer {this.state.checkedItem.length} lead(s) </span>
                    )}
                </div>
                <div className="reassign-content">
                    <div className="reassign-header-field">
                        <div className="row no-gutters">
                            <div className="col-12">
                                <label>Choose the sales {salesManager.length ? "manager" : "person"} as below</label>
                            </div>
                            <div className="col-11">
                                <InputComponent
                                    name="searchCriteria"
                                    placeholder="Enter employee name"
                                    withoutSpan={true}
                                    value={this.state.searchCriteria}
                                    handleChange={this.handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    {list}
                </div>
                <div className="reassign-footer">
                    <button onClick={toggle} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={this.handleAssign} className="btn-submit">
                        {this.props.buttonText ? this.props.buttonText : "Reassign"}
                    </button>
                </div>
            </div>
        );
    }
}

export default ReassignModal;
