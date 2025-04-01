import './About.css';
import Carousel from "./Carousel";
import paul from './about_images/PaulPhoto.jpg';

function About() {
    return (
        <div>
            <section id={"about-section"}>
                <h2>About This Simulator</h2>
                <div className="about-section">
                    <Carousel length={3}>
                        <Carousel.Item>
                            <h3 className={"header"}>Project Purpose</h3>
                            <p className={"carousel-text"}>
                                The JBF project contains simulations of 1D and 2D electrophoresis and is intended for
                                use in life science teaching and research. This application and its source code have
                                been under development by RIT students since 1997. Our future plans include adding
                                chromatography, tandem mass spectrometry and chemical drawing. If you are using
                                this resource, please send an email to Paul Craig (paul.craig@rit.edu) describing
                                how you are using it (course type, course level, # students, etc.).
                                If you are interested in contributing to this project, the source code is
                                available  on <a href={"https://github.com/lcb7105/RITSimulationofProteinSeparations"}>Github</a> under a _________ license.
                            </p>
                        </Carousel.Item>
                        <Carousel.Item>
                            <h3 className={"header"}>Commercial Use</h3>
                            <p className={"carousel-text"}>
                                JBioFramework is a set of chemical simulations frequently used
                            </p>
                        </Carousel.Item>
                        <Carousel.Item>
                            <h3 className={"header"}>Project Owner</h3>
                            <div className={"feat-box"}>
                                <img className={"feat-image"} src={paul} alt={"Headshot of Dr Craig"}/>
                                <div className={"feat-attr"}>
                                    <h3>Dr Paul Craig</h3>
                                    <p>
                                        Dr. Craig received his B.S. in Chemistry from Oral Roberts University in 1979,
                                        and his Ph.D. in Biological Chemistry from The University of Michigan in 1985.
                                        Following a post-doc at Henry Ford Hospital (biophysical chemistry of blood
                                        clotting; 1985-1988), he spent five years as an analytical biochemistry at BioQuant,
                                        Inc., in Ann Arbor, Michigan before joining RIT in 1993.
                                    </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </section>
        </div>
    );
}

export default About;