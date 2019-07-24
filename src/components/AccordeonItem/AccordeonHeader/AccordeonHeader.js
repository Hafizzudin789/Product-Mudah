import React from "react";
const AccordeonHeader = (props) => {
    const { expandAll, collapseAll } = props;
    return (
        <div>
            <button onClick={expandAll}>Expand All</button> / <button onClick={collapseAll}>Collapse All</button>
        </div>
    );
};

AccordeonHeader.propTypes = {
    expandAll: React.PropTypes.func,
    collapseAll: React.PropTypes.func,
};

export default AccordeonHeader;
