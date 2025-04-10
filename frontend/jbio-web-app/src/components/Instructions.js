import './Instructions.css';

function Instructions() {
    return (
        <div>
            {/* h1 title that displays instructions on the screen */}
            <h1 className="pageHeaderInstructions">Instructions</h1>
            {/* div that holds all the information for 1d and 2d instructions but used for flexbox css styling - explained in the css file instructions.css */}
            <div className='flexBoxContainerInstructions'>
                {/* section that  holds all the information about the first dimensional simulation instruction*/}
                <section className='oneDimensionalInstructions'>
                    {/* title displayed on the screen */}
                    <h2 id="1de" data-testId = '1de-header'>One-Dimensional Gel Electrophoresis</h2>
                    {/* explanation that these are instructions on the page */}
                    <p>
                        The following are step by step instructions on how to use the 1-D electrophoresis program
                    </p>
                    {/* numbered list of the instructions to use the simualtion */}
                    <ol>
                        <li>Select the number of wells</li>
                        <li>Select the proteins you want to test</li>
                        <li>Select an Acrylamide percentage</li>
                        <li>Select the standards you want present</li>
                        <li>Select a voltage</li>
                        <li>Press the Add Sample button</li>
                        <li>Press the Start Run button</li>
                    </ol>
                    {/* important notes the past team members mentioned about the simulation displayed on the screen */}
                    <p>
                        For cases with multiple samples, make sure to add all samples to each well.
                        You may also click on each of the strands in order to learn more about that protein.
                    </p>
                </section>
                {/* same explanations as above just 2de instead of 1de html code of instructions here */}
                <section className='twoDimensionalInstructions'>
                    <h2 className="section-header" id="2de" data-testId="2de-header">Two-Dimensional Gel Electrophoresis</h2>
                    <p>
                        The following are step by step instructions on how to use the 2-D electrophoresis program
                    </p>
                    <ol>
                        <li>BACKEND TEAM NEEDS TO ADD THE STEPS HERE</li>
                    </ol>
                    <p>
                        BACKEND NEEDS TO ADD ANY IMPORTANT NOTES HERE - LOOK AT 1-D FOR EXAMPLE OF WHAT I MEAN
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Instructions;
