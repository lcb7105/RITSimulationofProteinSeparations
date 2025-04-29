# JBioFramework Web Application
> The JBioFramework Web Application is a more efficient method of performing 1-Dimensional
> through the use of a browser and file selection in the format of 
> FASTA files. This document will contain information regarding [Download and Installation](#download-and-installation), 
> [Usage for Development](#usage-for-development), and [Testing Usage](#testing-usage) for the application.

## Project Sponsor
- [Dr. Paul Craig](mailto:pac8612@rit.edu)

![PaulPhoto.jpg](frontend%2Fjbio-web-app%2Fsrc%2Fcomponents%2Fabout_images%2FPaulPhoto.jpg)

Dr. Paul Craig received his B.S. in Chemistry from Oral Roberts University in 1979, and his Ph.D. in Biological Chemistry from The University of Michigan in 1985. Following a post-doc at Henry Ford Hospital (biophysical chemistry of blood clotting; 1985-1988), he spent five years as an analytical biochemistry at BioQuant, Inc., in Ann Arbor, Michigan before joining RIT in 1993.
## Download and Installation:
### Git

```bash
git clone https://github.com/AmrMualla/RITSimulationofProteinSimulations.git
```

Windows:
```bash
cd RITSimulationofProteinSimulations\
```

```bash
pip install -r requirements.txt
```

macOS or Linux:
```bash
cd RITSimulationofProteinSimulations/
```

```bash
pip install -r requirements.txt
```

### Software Requirements
- Python 3.7 or higher
- Node.js 20.11.0 or higher
- React 18.2.0 or higher

## Usage for Development
Navigate to the top level directory by typing in the command line 

Windows:
```bash
cd RITSimulationofProteinSimulations\
```

macOS or Linux:
```bash
cd RITSimulationofProteinSimulations/
```
<br/>

Launch the API server by typing in the command line:
```bash
uvicorn server:app --reload
```

<br/>

In a new terminal, launch the 2-dimensional electrophoresis backend by first navigating to the Electro2D subdirectory by typing in the command line
Windows:
```bash
cd backend\Electro2D\
```

macOS or Linux:
```bash
cd backend/Electro2D/
```

Then, launch the 2D.py file by typing in the command line:
Windows:
```bash
py 2D.py
```

macOS or Linux:
```bash
python3 2D.py
```

<br/>

Then in a new terminal, navigate to the jbio-web-app subdirectory by typing in the command line 

Windows:
```bash
cd frontend\jbio-web-app\
```

macOS or Linux:
```bash
cd frontend/jbio-web-app/
```

Then, launch the application by typing in the command line:
```bash
npm start
```

A browser will open with the URL: http://localhost:3000/

Navigate through the website using the navbar at the top and follow the instructions on the simulations to run them.

## Testing Usage

### Frontend Guide:

#### Introduction

This guide will be going over the basics of the Jest tests created in this project, including how to install Jest, create a basic Jest class, and the standards followed creating the existing Jest tests. Jest was a great choice for the team because of the choice to use Node.js and React. Jest synergizes very well with both of these and makes it easy to use.

#### Installation

Installation for Jest is simple with the help of a package manager. Since we are using Node.js with ```npm``` as the package manager, installation is easy.

First navigate to the jbio-web-app subdirectory by typing in the command line

Windows:
```bash
..\RITSimulationofProteinSimulations\frontend\jbio-web-app
```

macOS or Linux:

```bash
~/RITSimulationofProteinSimulations/frontend/jbio-web-app
```

Then run this command to install jest

```bash
npm install --save-dev jest
```

#### Running the Tests
Once the installation is complete, typing 

```bash
npm test
```

will bring up the watch usage buttons which you can use to run the tests. If there is every an error saying:

```bash 
npm test is not recognized
```

 type: 

```bash
npm install
```

again to update the package. Then you should see this:

```a```will run all the test suites.

```f``` will run all the failed tests.

```p``` will let you chose a test suite to test by typing its name.

```t``` will let you chose a specific test to test by typing its name.

```q``` will end the session.

After running a test, it will tell you how many test suites and tests have passed and if they failed, where and why they did.

#### Jest Test Basics
If on Windows, the Jest tests are stored in

```bash
.\\RITSimulationofProteinSimulations\frontend\jbio-web-app\src\components\__tests__
```

If on macOS or Linux, the Jest tests are stored in

```bash
~/RITSimulationofProteinSimulations/frontend/jbio-web-app/src/components/__tests__
```

<br/>

Currently, there is a test class for each frontend component in the project. They all vary depending on the component but all have a similar format that should be used when creating more tests. 

You always need the first line of the file to import React. The second line is the same format, but you will add in methods you use in your tests. Some examples would be ```render```, ```fireEvent```, ```screen```, and various others.

For creating new tests, just follow the same format as the current tests, testing for the correct components to be in the window.

### Backend Guide:
#### Author: Mack Leonard

Navigate to the top level directory by typing in the command line, changing the "ProteinTest" into the name of the test file you want to run.

Windows:
```bash
cd .\RITSimulationofProteinSimulations\
py -m unittest backend.Electro1DTests.ProteinTest
```

macOS or Linux:
```bash
cd ~/RITSimulationofProteinSimulations/
python3 -m unittest backend.Electro1DTests.ProteinTest
```

OR

Some IDEs have a built-in run function for files that can be executed. If you wish to do this, navigate to the ProteinTest.py or any other test file and click the run button.

<br/>

## Project Team

- Fall 2023 to Spring 2024:
  - Coach:
    - [Mark Wilson](mailto:mwvse@rit.edu)
  - Developers:
    - [Chase Amador](https://www.linkedin.com/in/chase-amador-54765b209/)

    - [Beck Anderson](https://www.linkedin.com/in/beck-anderson-se/)

    - [Landon Heatly](https://www.linkedin.com/in/landon-heatly-77a093175/)

    - [Mack Leonard](https://www.linkedin.com/in/mack-leonard/)

    - [Amr Mualla](https://www.linkedin.com/in/amrmualla/)

- Fall 2024 to Spring 2025:
  - Coach:
    - [Mark Wilson](mailto:mwvse@rit.edu)
  - Developers:
    - [Bryson VerDow](https://www.linkedin.com/in/bryson-verdow/)

    - [Jackson Murphy](https://www.linkedin.com/in/jackson-murphy01/)

    - [Cameron Miele](https://www.linkedin.com/in/cameronmiele/)

    - [Castor Grey](https://www.linkedin.com/in/castor-grey-babab9182/)

    - [Toula Elwell](https://www.linkedin.com/in/toula-elwell/)
