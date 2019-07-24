import React from "react";
import { Accordeon, Panel, Nav, Content } from "react-accordeon";
import AccordeonHeader from "./AccordeonHeader";
import AccordeonFooter from "./AccordeonFooter";
// import NavComponent from './NavComponent';
// import ContentComponent from './ContentComponent';
class AccordeonItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Accordeon header={<AccordeonHeader />} footer={<AccordeonFooter />}>
                <Panel key="panel1">
                    <Nav>Question 1</Nav>
                    <Content>
                        <div>
                            <img src="https://placekitten.com/g/500/500" alt="kittlen" />
                        </div>
                    </Content>
                </Panel>
                <Panel key="panel2" expanded>
                    <Nav>nav</Nav>
                    <Content>content</Content>
                </Panel>
            </Accordeon>
        );
    }
}

export default AccordeonItem;
