import './Instructions.css';

function Instructions() {
    return (
        <div>
            <h1 className="pageHeaderInstructions">Instructions</h1>
            <div className='flexBoxContainerInstructions'>
                <section className='oneDimensionalInstructions'>
                    <h2 id="1de" data-testId = '1de-header'>One-Dimensional Gel Electrophoresis</h2>
                    <p>
                        The following are step by step instructions on how to use the 1-D electrophoresis program
                    </p>
                    <ol>
                        <li>Select the number of wells</li>
                        <li>Select the proteins you want to test</li>
                        <li>Select an Acrylamide percentage</li>
                        <li>Select the standards you want present</li>
                        <li>Select a voltage</li>
                        <li>Press the Add Sample button</li>
                        <li>Press the Start Run button</li>
                    </ol>
                    <p>
                        For cases with multiple samples, make sure to add all samples to each well.
                        You may also click on each of the strands in order to learn more about that protein.
                    </p>
                </section>

                <section className='twoDimensionalInstructions'>
                    <h2 className="section-header" id="2de" data-testId="2de-header">Two-Dimensional Gel Electrophoresis</h2>
                    <p>
                        The following are step by step instructions on how to use the 1-D electrophoresis program
                    </p>
                    <ol>
                        <li>Select the number of wells</li>
                        <li>Select the proteins you want to test</li>
                        <li>Select an Acrylamide percentage</li>
                        <li>Select the standards you want present</li>
                        <li>Select a voltage</li>
                        <li>Press the Add Sample button</li>
                        <li>Press the Start Run button</li>
                    </ol>
                    <p>
                        For cases with multiple samples, make sure to add all samples to each well.
                        You may also click on each of the strands in order to learn more about that protein.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Instructions;
