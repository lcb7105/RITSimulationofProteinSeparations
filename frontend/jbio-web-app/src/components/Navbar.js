import React, { useState } from 'react';
import '../components/Navbar.css';
import {NavLink} from "react-router-dom";
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
                    <li><p>Simulators</p></li>
                    <li><NavLink to={"/instructions"}>Instructions</NavLink></li>
                    <li><NavLink to={"/contact"}>Contact</NavLink></li>
                </ul>
            </div>
        </div>
    );}
}