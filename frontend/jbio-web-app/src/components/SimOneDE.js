import './SimOneDE.css';

function SimOneDE() {
    return (
        <div>
            <h1>1D Electrophoresis Simulator</h1>
            <div className='simulatorBoxOneDE'>

            </div>
            <section>
                <h2>1DE Simulator Instructions</h2>
                <h3>Steps</h3>
                <ol>
                    <li>1. Add or drop wells as desired.</li>
                    <li>2. Click the "Select Folder" button to upload a folder or click a well to upload a file for that well.</li>
                    <li>3. Select/deselect the standards that you would like to run.</li>
                    <li>4. Set the voltage at the desired amount (50/100/150/200V).</li>
                    <li>5. Set the acrylamide percentage at the desired amount (7.5/10/12/15%).</li>
                    <li>6. Click the "Start" button to run the wells.</li>
                    <li>7. Click the "Stop" button to manually stop the wells</li>
                    <li>8. Click the "Refill Wells" button to stop the run and reset the filled wells with the protein bands at their inital position.</li>
                </ol>
                <h3>Notes</h3>
                <ul>
                    <li>Exact number of wells are not required (if you would like to run 5 wells, you may have 6 or more wells created).</li>
                    <li>The dye will always run in every well that is filled.</li>
                    <li>The protein bands will automatically stop at their relative migration distance down the well based on the dye.</li>
                </ul>
            </section>
        </div>
    );
}

export default SimOneDE;
