import React, { useState } from 'react';
import './Carousel.css';

function Carousel({children, ...props}){
    const [index, setIndex] = useState(0);
    const handlePrevious = () => {
        const newIndex = index - 1;
        setIndex(newIndex < 0 ? props.length - 1 : newIndex);
    };
    const handleNext = () => {
        const newIndex = index + 1;
        setIndex(newIndex >= props.length ? 0 : newIndex);
    };

    return (
        <div className="carousel">
            <button className={"chevron"} id={"button-prev"} onClick={handlePrevious}></button>
            {children[index]}
            <button className={"chevron"} id={"button-next"} onClick={handleNext}></button>
        </div>
    );
};

function CarouselItem({children, ...props}) {
    return(
        <div className="carousel-item">
            {children}
        </div>
    );
}
Carousel.Item = CarouselItem;

export default Carousel;