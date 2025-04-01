
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
import cameron from "./about_images/Cameron.png";
import jackson from "./about_images/jackson.png";
import placeholder from './about_images/placeholder.png';

import './Contact.css';

function Contact() {
    return (
        // a div tag container that holds all the html contact for the contact page
        <div className='contactPage'>
            {/* An h1 title tag that is the "Contact" title shown on the screen */}
            <h1 className="pageHeaderContact">Contact</h1>
            {/* A section tag that contains the two boxes on the page showing the coach and the sponsor */}
            <section className="coachSponsorContactContainer">
                {/* A div container that holds all the information of the coach that you can see on the screen */}
                <div>
                    {/* An h2 title that displays the words Team Coach on the screen */}
                    <h2>Team Coach</h2>
                    {/* An image tag that shows an image of the coach on the screen */}
                    <img className="profile-icon" src={placeholder} alt="Mark Wilson-pic"></img>
                    {/* A span tag that groups the other information about the coach on the screen */}
                    <span className='sideTabletDesktop'>
                        {/* An h3 title that shows the works Mark Wilson on the page */}
                        <h3>Mark Wilson</h3>
                        {/* An hr tag that shows the line under the coaches name */}
                        <hr></hr>
                        {/* A unordered list tag that displays information about the coach in bullet form */}
                        <ul>
                            {/* This list element shows the coaches rit email with another list inside for formatting */}
                            <li>RIT Email: 
                                <ul>
                                    {/* This a tag gives a link to the coaches email and displays it on the screen, with the href being the actual link, putting mailto: and then the email opens up email when you click on the link on the page */}
                                    <li><a href="mailto:mwvse@rit.edu" target="_blank" title="Click to Email Mark using his RIT email">mwvse@rit.edu</a></li>    
                                </ul>    
                            </li>
                            {/* This list element shows the coaches rit email with another list inside for formatting */}
                            <li>Email: 
                                <ul>
                                    {/* This a tag gives a link to the coaches email and displays it on the screen, with the href being the actual link, putting mailto: and then the email opens up email when you click on the link on the page */}
                                    <li><a href="mailto:mwilson1962@gmail.com" target="_blank" title="Click to Email Mark using his PERSONAL email">mwilson1962@gmail.com</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div> 
                {/* The ending tag of the coaches information above as /div */}
                {/* this div holds the project sponsors information as seen on the screen or page */}
                <div>
                    {/* An h2 tag that displays the words project sponsor on the screen */}
                    <h2>Project Sponsor</h2>
                    {/* An image tag that shows an image of the project sponsors face on the screen */}
                    <img className="profile-icon" src={paul} alt="Paul Craig-pic"></img>
                    {/* a span tag that holds all the information about the sponsor on the page */}
                    <span className='sideTabletDesktop'>
                        {/* an h3 tag that displays the name of the sponsor on the screen */}
                        <h3>Dr. Paul Craig</h3>
                        {/* an hr tag that shows a line underneath the name of the sponsor on the screen */}
                        <hr></hr>
                        {/* an unordered list tag that displays the sponsors information on the screen in bullet form since it's ul */}
                        <ul>
                            {/* a list element that shows the sponsors rit email in bullet form */}
                            <li>RIT Email: 
                                <ul>
                                    {/* the a link allows you to email the sponsor coach on a separate page when clicked on */}
                                    <li><a href="mailto:paul.craig@rit.edu" target="_blank" title="Click to Email Paul using his RIT email">paul.craig@rit.edu</a></li>
                                </ul>    
                            </li>
                            {/* An li list element that shows the sponsors phone number */}
                            <li>Phone: 
                                <ul>
                                    {/* An a tag that when clicked on on the screen call the number */}
                                    <li><a href="tel:+15854756145" title="Click to call Paul if you're on your phone">+1(585)475-6145</a></li>
                                </ul>
                            </li>
                        </ul>
                    </span>
                </div>
            </section>
            {/* to add new team members, copy and paste this whole span and change the class name of the old one to the past team members since Toula would no longer be a current team member  */}
            {/* ------------------------------------- the rest of the code is the same explanation as above ------------------------------------------------------------------------------------------------------------------------------------------ */}
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
                                <li>Roles: 
                                    <ul>
                                        <li>Project Manager</li>
                                        <li>Front-End Developer</li>
                                    </ul>    
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div>
                        <img className="profile-icon" src={cameron} alt="Cameron Miele-pic"></img>
                        <span className='widthForContentUnderHR'>
                            <h3>Cameron Miele</h3>
                            <hr></hr>
                            <ul>
                                <li>RIT Email: 
                                    <ul>
                                        <li><a href="mailto:clm1886@rit.edu" target="_blank" title="Click to Email Cameron using his RIT email">clm1886@rit.edu</a></li>
                                    </ul>
                                </li>
                                <li>Roles: 
                                    <ul>
                                        <li>Scrum Master</li>
                                        <li>Sponsor Communications Lead</li>
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
                                <li>Role: 
                                    <ul>
                                        <li>Testing Lead</li>
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
                                <li>Roles: 
                                    <ul>
                                        <li>Technical Lead</li>
                                        <li>Front-End Developer</li>
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
                                <li>Role: 
                                    <ul>
                                        <li>Networking Lead</li>
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
                        </ul>
                    </span>
                </div>
            </section>
        </div>
    );
}

export default Contact;
