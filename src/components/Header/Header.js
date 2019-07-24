/*eslint-disable */
import React from 'react';
import './Header.scss';

class Header extends React.Component {
    render() {
        return (
                        <nav>
                            <span className="nav-button">
                            ☰
                            </span>
                            <ul className="nav" role="navigation">
                            <span className="pad" >easy.com</span>               
                            <li className="active">
                                <a href="#">Categories</a>
                            </li>
                            <li>
                                <a href="#">Notification</a>
                            </li>
                            <li>
                                <a href="#">Login /Sign up</a>
                            </li>
                            <li>
                                <a href="#">contact</a>
                            </li>
                            </ul>
                        </nav>
        );
    }
}

export default Header;
/*eslint-disable */

