import {createBrowserRouter, RouterProvider} from "react-router-dom";

import About from './components/About.js';
import OneDE from './components/OneDE.js';
import TwoDE from './components/TwoDE.js';
import Instructions from './components/Instructions.js';
import Contact from './components/Contact.js';

/**
 * Main organizer for the core components of the application.
 * If future developments are to be made, their respective
 * React items should be added here. For instance,
 *     - Marvin Sketch
 *     - Tandem Mass Spectrometer
 *     - Chromatography
 * To implement these, add their respective .js component in the
 * /components folder and import the component above. Add the element
 * to the list of components below.
 * 
 * @param isOpen - Whether or not the sidebar is collapsed or not
 * @returns {RouterProvider} - The router react object
 */
function Router({isOpen}) {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <About />,
      },
      {
        path: "1de",
        element: <OneDE />,
      },
      {
        path: "2de",
        element: <TwoDE />,
      },
      {
        path: "instructions",
        element: <Instructions />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ]);
    return (
        <div className={isOpen ? "content" : "content-collapsed"}>
            <RouterProvider router={router} />
        </div>
    );
}

export default Router;