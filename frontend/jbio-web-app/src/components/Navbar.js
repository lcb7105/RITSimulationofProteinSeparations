import React from 'react';
import '../components/Navbar.css';
import {NavLink} from "react-router-dom";
import Dropdown from "./Dropdown";
export default class Navbar extends React.Component{
    render(){
    return (
        <div className="nav-container">
            <div className={"logo"}>
                <div className={"temp-icon"}></div>
                <span id={"nav-logo"}>JBioFramework</span>
            </div>
            <div className={"navbar"}>
                <ul>
                    <li><NavLink to={"/"} >About</NavLink></li>
                    <Dropdown>
                        <Dropdown.Button><a>Simulators</a></Dropdown.Button>
                        <Dropdown.Content>
                            <Dropdown.List>
                                <Dropdown.Item to="/1de">1D Electrophoresis</Dropdown.Item>
                                <Dropdown.Item to="/2de">2D Electrophoresis</Dropdown.Item>
                            </Dropdown.List>
                        </Dropdown.Content>
                    </Dropdown>
                    <li><NavLink to={"/instructions"}>Instructions</NavLink></li>
                    <li><NavLink to={"/contact"}>Contact</NavLink></li>
                </ul>
            </div>
        </div>
    );}
}