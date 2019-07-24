import React from "react";
const AccordeonFooter = (props) => {
    const { expandAll, collapseAll } = props;
    return (
        <div>
            <span onClick={expandAll}>Expand All</span> / <span onClick={collapseAll}>Collapse All</span>
        </div>
    );
};

AccordeonFooter.propTypes = {
    expandAll: React.PropTypes.func,
    collapseAll: React.PropTypes.func,
};

// The Footer must be a valid React component (Footer.js).
// Two functions are also passed as properties: expandAll, collapseAll
export default AccordeonFooter;
