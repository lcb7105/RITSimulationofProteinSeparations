import './About.css';
import Carousel from "./Carousel";
const devboxstyle = {
    display: "flex",
    justifyContent: "space-around"
};

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
                                JBioFramework (JBF) is a set of chemical simulations frequently used in chemistry,
                                biochemistry, and proteomics research. It's main purpose is to allow for simplified
                                simulation of proteins for academic and research opportunities. It is owned and operated
                                by the RIT College of Science under the watch of Paul Craig. It is continuously being
                                worked on with collaboration between the RIT College of Science and the RIT Software
                                Engineering Department.
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
                            <div style={devboxstyle}>
                                <div className={"feat-box"}>
                                    <div className={"feat-image"}></div>
                                    <div className={"feat-attr"}>
                                        <h3>Name</h3>
                                    </div>
                                </div>
                                <p>
                                    Dr. Paul Craig received his B.S. in Chemistry from Oral Roberts University in 1979,
                                    and his Ph.D. in Biological Chemistry from The University of Michigan in 1985.
                                    Following a post-doc at Henry Ford Hospital (biophysical chemistry of blood
                                    clotting; 1985-1988), he spent five years as an analytical biochemistry at BioQuant,
                                    Inc., in Ann Arbor, Michigan before joining RIT in 1993.
                                </p>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </section>
            {/*<section id={"past-developers"}>*/}
            {/*    <h2>Past Developers</h2>*/}
            {/*    <div className={"developer-section"}>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*<section id={"current-developers"}>*/}
            {/*    <h2>Current Developers</h2>*/}
            {/*    <div className={"developer-section"}>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className={"feat-box"}>*/}
            {/*            <div className={"feat-image"}></div>*/}
            {/*            <div className={"feat-attr"}>*/}
            {/*                <h3>Developer Name</h3>*/}
            {/*                <p>Title</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    );
}

export default About;