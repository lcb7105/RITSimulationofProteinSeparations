import React, { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts'
import * as ReactDOM from "react-dom/client";
import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';
import Router from './Router.js';
import { DarkToggle } from './components/DarkToggle.js';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Contact from "./components/Contact";
import About from "./components/About";
import Instructions from "./components/Instructions";
import Layout from "./Layout";


function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('isSidebarOpen', true);
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage('isDark', preference);

    return (
        // <div className="app-container" data-theme={isDark ? "dark" : "light"}>
        //     {/*<Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} isDark={isDark} />*/}
        //     <BrowserRouter>
        //         <Router isOpen={isSidebarOpen} />
        //     </BrowserRouter>
        //     <DarkToggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
        // </div>

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<About/>}/>
                    <Route path="instructions" element={<Instructions />}/>
                    <Route path="contact" element={<Contact/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
