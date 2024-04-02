import React, { useState, useRef, useEffect } from 'react';
import './Accordion.css';
import { accordionText } from './text';

const useOutsideClick = (callback) => {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [ref]);

    return ref;
}

function Accordion({ icon=null, children }) {
    const [isActive, setActive] = useState(false);
    const [isBlurred, setBlurred] = useState(false);
    const [timerId, setTimerId] = useState(null);
    const contentEl = useRef();
    const { name, info } = accordionText.find((e) => e.icon === icon);
    const ref = useOutsideClick(() => { setActive(false); });

    useEffect(() => {
        
        // Reset blur animation if button is clicked before timer elapses
        if (isBlurred) {

            const id = setTimeout(() => {
                setBlurred(false);
            }, 2000);

            setTimerId(id);
        }
    }, [isBlurred]);

    const handleToggle = () => {
        setActive(!isActive);

        // Blur animation at bottom of content-wrapper
        if (isBlurred) {

            setBlurred(false);
            setTimeout(() => {
                setBlurred(true);
            }, 1);
        } else {

            setBlurred(true);
        }
        clearTimeout(timerId);
    };
    
    return (
        <div ref={ref} className="accordion">
            <button className="button" onClick={ handleToggle }>
                {icon !== null && <div className="icon"><img src={require(`../picture/${icon}.png`)} alt={icon}/></div>}
                <span className="title_wrapper">
                    <h2>{ name }</h2>
                    <span className="control">{isActive ? "－" : "＋"}</span>
                </span>
            </button>
            <div ref={ contentEl } 
                 className={`content_wrapper ${isBlurred ? 'blur' : ''}`}
                 style={
                    isActive
                    ? { height: contentEl.current.scrollHeight }
                    : { height: "0px" }
                 }>
                {<div className="content">
                    {children}
                </div>}
            </div>
        </div>
    )
}

export default Accordion;