
// import mark from "./about_images/";
import paul from './about_images/PaulPhoto.jpg';
import beck from "./about_images/Beck_Anderson.png";
import chase from "./about_images/Chase_Amador.png";
import amr from "./about_images/Amr_Mualla.png";
import landon from "./about_images/Landon_Heatly.png";
import mack from './about_images/Mack_Leonard.png';
import toula from "./about_images/Toula_Elwell.png";
import bryson from "./about_images/Bryson.png";
import castor from "./about_images/castor.png";
// import cameron from "./about_images/";
import jackson from "./about_images/jackson.png";
import placeholder from './about_images/placeholder.png';

import './Contact.css';

function Contact() {
    return (
        <div className='contactPage'>
            <h1 className="pageHeaderContact">Contact</h1>
            <section className="coachSponsorContactContainer">
                <div>
                    <h2>Team Coach</h2>
                    <img className="profile-icon" src={placeholder} alt="Mark Wilson-pic"></img>
                    <span className='sideTabletDesktop'>
                        <h3>Mark Wilson</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:mwvse@rit.edu" target="_blank" title="Click to Email Mark using his RIT email">mwvse@rit.edu</a></li>    
                                </ul>    
                            </li>
                            <li>Email: 
                                <ul>
                                    <li><a href="mailto:mwilson1962@gmail.com" target="_blank" title="Click to Email Mark using his PERSONAL email">mwilson1962@gmail.com</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>
                <div>
                    <h2>Project Sponsor</h2>
                    <img className="profile-icon" src={paul} alt="Paul Craig-pic"></img>
                    <span className='sideTabletDesktop'>
                        <h3>Dr. Paul Craig</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:pac8612@rit.edu" target="_blank" title="Click to Email Paul using his RIT email">pac8612@rit.edu</a></li>
                                </ul>    
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+15854756145" title="Click to call Paul if you're on your phone">+1(585)475-6145</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>
            </section>
            
            <span className='currentTeamMembersBackground'>
                <h2>Current Team Members</h2>
                <section className="currentTeamMembers">
                    <div>
                        <img className="profile-icon" src={toula} alt="Toula Elwell-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Toula Elwell</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:tae9467@rit.edu" target="_blank" title="Click to Email Toula using her RIT email">tae9467@rit.edu</a></li>
                                    </ul></li>
                                <li>Phone: 
                                    <ul>
                                        <li><a href="tel:+15852002069" title="Click to call Toula if you're on your phone">+1(585)200-2069</a></li>
                                    </ul>    
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div>
                        <img className="profile-icon" src={placeholder} alt="Cameron Miele-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Cameron Miele</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:clm1886@rit.edu" target="_blank" title="Click to Email Cameron using his RIT email">clm1886@rit.edu</a></li>
                                    </ul>
                                </li>
                                <li>Phone: 
                                    <ul>
                                        <li><a href="tel:+16034013733" title="Click to call Cameron if you're on your phone">+1(603)401-3733</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div>
                        <img className="profile-icon" src={bryson} alt="Bryson VerDow-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Bryson VerDow</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:bjv7412@rit.edu" target="_blank" title="Click to Email Bryson using his RIT email">bjv7412@rit.edu</a></li>
                                    </ul>
                                </li>
                                <li>Phone: 
                                    <ul>
                                        <li><a href="tel:+13157531212" title="Click to call Bryson if you're on your phone">+1(315)753-1212</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div>
                        <img className="profile-icon" src={castor} alt="Castor Grey-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Castor Grey</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:lcb7105@rit.edu" target="_blank" title="Click to Email Castor using his RIT email">lcb7105@rit.edu</a></li>
                                    </ul>
                                </li>
                                <li>Phone: 
                                    <ul>
                                        <li><a href="tel:+12403003247" title="Click to call Castor if you're on your phone">+1(240)300-3247</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div>
                        <img className="profile-icon" src={jackson} alt="Jackson Murphy-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Jackson Murphy</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:jmm5915@rit.edu" target="_blank" title="Click to Email Jackson using his RIT email">jmm5915@rit.edu</a></li>
                                    </ul>
                                </li>
                                <li>Phone: 
                                    <ul>
                                        <li><a href="tel:+16037147265" title="Click to call Jackson if you're on your phone">+1(603)714-7265</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </span>
                    </div>
                </section>
            </span>

            <h2>Past Team Members</h2>
            <section className="pastTeamMembers">
                <div>
                    <img className="profile-icon" src={amr} alt="Amr Mualla-pic"></img>
                    <span className='widthForContentUnderHR'>
                        <h3>Amr Mualla</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:am3576@rit.edu" target="_blank" title="Click to Email Amr using their RIT email">am3576@rit.edu</a></li>
                                </ul>
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+13476317359" title="Click to call Amr if you're on your phone">+1(347)631-7359</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>

                <div>
                    <img className="profile-icon" src={beck} alt="Beck Anderson-pic"></img>
                    <span className='widthForContentUnderHR'>
                        <h3>Beck Anderson</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:bea1935@rit.edu" target="_blank" title="Click to Email Beck using their RIT email">bea1935@rit.edu</a></li>
                                </ul>
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+17166402894" title="Click to call Beck if you're on your phone">+1(716)640-2894</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>

                <div>
                    <img className="profile-icon" src={chase} alt="Chase Amador-pic"></img>
                    <span className='widthForContentUnderHR'>
                        <h3>Chase Amador</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:cma6320@rit.edu" target="_blank" title="Click to Email Chase using their RIT email">cma6320@rit.edu</a></li>
                                </ul>
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+12037254442" title="Click to call Chase if you're on your phone">+1(203)725-4442</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>

                <div>
                    <img className="profile-icon" src={landon} alt="Landon Heatly-pic"></img>
                    <span className='widthForContentUnderHR'>
                        <h3>Landon Heatly</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:lbh1442@rit.edu" target="_blank" title="Click to Email Landon using their RIT email">lbh1442@rit.edu</a></li>
                                </ul>
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+12038329841" title="Click to call Landon if you're on your phone">+1(203)832-9841</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>

                <div>
                    <img className="profile-icon" src={mack} alt="Mack Leonard-pic"></img>
                    <span className='widthForContentUnderHR'>
                        <h3>Mack Leonard</h3>
                        <hr></hr>
                        <ul>
                            <li>RIT Email: 
                                <ul>
                                    <li><a href="mailto:mml2034@rit.edu" target="_blank" title="Click to Email Mack using their RIT email">mml2034@rit.edu</a></li>
                                </ul>
                            </li>
                            <li>Phone: 
                                <ul>
                                    <li><a href="tel:+12037319620" title="Click to call Mack if you're on your phone">+1(203)731-9620</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>
            </section>
        </div>
    );
}

export default Contact;
