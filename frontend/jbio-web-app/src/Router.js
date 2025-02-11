// import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
//
// import About from './components/About.js';
// import OneDE from './components/OneDE.js';
// import TwoDE from './components/TwoDE.js';
// import Instructions from './components/Instructions.js';
// import Contact from './components/Contact.js';
// import Navbar from "./components/Navbar";
//
// function Router({isOpen}) {
//     const router = createBrowserRouter([
//         {
//             path: "/",
//             element: <NavbarWrapper/>,
//             children:[
//                 {
//                     path: "/",
//                     element: <About />,
//                 },
//                 {
//                     path: "1de",
//                     element: <OneDE />,
//                 },
//                 {
//                     path: "2de",
//                     element: <TwoDE />,
//                 },
//                 {
//                     path: "instructions",
//                     element: <Instructions />,
//                 },
//                 {
//                     path: "contact",
//                     element: <Contact />,
//                 },
//             ]
//         }
//     ]);
// }
//
// function NavbarWrapper(){
//     return (
//         <div>
//             <Navbar/>
//             <Outlet/>
//         </div>
//     );
// }
//
// export default Router;