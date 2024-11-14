import React, { useState } from 'react';
import '../components/Navbar.css';
function Navbar(){
    return (
        <div className="nav-container">
            {/*<div className={"logo"}>*/}
            {/*    <span id={"nav-logo"}>JBioFramework</span>*/}
            {/*</div>*/}
            <div className={"navbar"}>
                <ul>
                    <li>About</li>
                    <li>Simulators</li>
                    <li>Instructions</li>
                    <li>Contact</li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;