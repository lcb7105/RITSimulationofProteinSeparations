import './SimTwoDE.css';
import './TwoDE.js';
import TwoDE from "./TwoDE";

function SimTwoDE() {
    return (
        <div className="sim-container">
            <h1>2D Electrophoresis Simulator</h1>
            <div className='simulatorBoxTwoDE'>
                <TwoDE/>
            </div>
            <section className='TwoDEinstructions'>
                <h2>2DE Simulator Instructions</h2>
                <h3>Steps</h3>
                <ol>
                    <li>ADD STEPS HERE BACKEND TEAM</li>
                </ol>
                <h3>Notes</h3>
                <ul>
                    <li></li>
                </ul>
            </section>
        </div>
    );
}

export default SimTwoDE;
