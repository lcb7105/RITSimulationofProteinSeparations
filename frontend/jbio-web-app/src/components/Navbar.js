import React, { useState } from 'react';
import '../components/Navbar.css';
import {NavLink} from "react-router-dom";
export default class Navbar extends React.Component{
    // const {location} = this.props;
    // const instActive = location.pathname.includes('instructions')
    // const aboutActive = location.pathname === "/"
    render(){
    return (
        <div className="nav-container">
            {/*<div className={"logo"}>*/}
            {/*    <span id={"nav-logo"}>JBioFramework</span>*/}
            {/*</div>*/}
            <div className={"navbar"}>
                <ul>
                    <li><NavLink to={"/"} activeClassName={"active"}>About</NavLink></li>
                    <li>Simulators</li>
                    <li><NavLink to={"/instructions"} activeClassName={"active"}>Instructions</NavLink></li>
                    <li>Contact</li>
                </ul>
            </div>
        </div>
    );}
}