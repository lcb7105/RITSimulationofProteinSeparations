import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../components/Dropdown.css"

export const DropdownContext = React.createContext({
    open: false
});

Dropdown.Context = DropdownContext;

function Dropdown({ children, ...props }) {
    const [open,  setOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        function close(e){
            if(!dropdownRef.current.contains(e.target)){
                setOpen(false);
            }
        }
        if(open){
            window.addEventListener("click", close);
        }
        return function removeListener() {
            window.removeEventListener("click", close);
        }
    }, [open]);
    return (
        <DropdownContext.Provider value={{ open: open, setOpen: setOpen }}>
            <div ref={dropdownRef} className={"dropdown-container"}>{children}</div>
        </DropdownContext.Provider>
    );
};

function DropdownButton({children, ...props}) {
    const {open, setOpen} = React.useContext(DropdownContext);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <button onClick={toggleOpen} className={"dropdown-button"}>
            {children}
            <i style={{margin: 5}} className={`fa-solid ${open ? "fa-chevron-up": "fa-chevron-down"}`}></i>
        </button>
    )
}

Dropdown.Button = DropdownButton;

function DropdownContent({children}) {
    const {open, setOpen} = React.useContext(DropdownContext);

    return (
        <div className={`dropdown-content ${ open ? "open": "hidden"}`}>
            {children}
        </div>
    )
}

Dropdown.Content = DropdownContent;

function DropdownList({children, ...props}) {
    const {setOpen} = React.useContext(DropdownContext);

    return(
        <ul onClick={() => setOpen(false)   } className="dropdown-list" {...props}>
            {children}
        </ul>
    );
};

Dropdown.List = DropdownList;

function DropdownItem({children, ...props}){
    return(
        <li>
            <Link {...props}>{children}</Link>
        </li>
    );
}

Dropdown.Item = DropdownItem;

export default Dropdown;