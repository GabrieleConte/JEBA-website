import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import './styles.css';

interface CardProps {
    imageUrl: string;
    description: string;
    isCurrent: boolean;
}

const Card: React.FC<CardProps> = ({ imageUrl, description, isCurrent }) => {
    return (
        <div className={`card ${isCurrent ? 'current' : 'side'}`}>
            <div className="card-content">
                <img src={imageUrl} alt="Display" className="card-image" />
                {isCurrent && false && (
                    <div className="card-description">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

interface FileMapping {
    name: string;
}

interface GalleryItem {
    name: string;
    imageUrl: string;
    description: string;
}

const Gallery: React.FC = () => {
    const files: FileMapping[] = [
        { name: 'scan_page_1' },
        { name: 'scan_page_2' },
        { name: 'scan_page_3' },
        { name: 'scan_page_4' },
        { name: 'scan_page_5' },
        { name: 'scan_page_6' },
        { name: 'scan_page_7' },
        { name: 'scan_page_8' },
        { name: 'scan_page_9' },
        { name: 'scan_page_10' },
        { name: 'scan_page_11' },
        { name: 'scan_page_12' },
        { name: 'scan_page_13' },
        { name: 'scan_page_14' },
        { name: 'scan_page_15' },
        { name: 'scan_page_16' },
        { name: 'scan_page_17' },
        { name: 'scan_page_18' },
        { name: 'scan_page_19' },
        { name: 'scan_page_20' },
        { name: 'scan_page_21' },
    ];

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeStartX, setSwipeStartX] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const basePath = '/assets/';

    useEffect(() => {
        const loadItems = async () => {
            const fetchedItems = await Promise.all(
                files.map(async (file) => {
                    const imageUrl = `${basePath}${file.name}.jpg`;
                    const descriptionUrl = `${basePath}${file.name}.txt`;

                    let description = '';
                    try {
                        const res = await fetch(descriptionUrl);
                        if (res.ok) {
                            description = await res.text();
                        } else {
                            console.error(`Error fetching description for ${file.name}: ${res.status}`);
                        }
                    } catch (err) {
                        console.error(`Fetch error for ${file.name}:`, err);
                    }
                    return { name: file.name, imageUrl, description };
                })
            );
            setItems(fetchedItems);
        };

        loadItems();
    }, []);

    const handlePrev = () => {
        setDirection('prev');
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setDirection('next');
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setIsSwiping(true);
        setSwipeStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) return;
        
        const currentX = e.touches[0].clientX;
        const diff = swipeStartX - currentX;
        
        // Optional: add some visual feedback during swiping
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(${-diff * 0.1}px)`;
        }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (!isSwiping) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = swipeStartX - endX;
        
        // Reset any transform
        if (carouselRef.current) {
            carouselRef.current.style.transform = '';
        }
        
        if (Math.abs(diff) > 50) { // Threshold for swipe detection
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        
        setIsSwiping(false);
    };

    if (items.length === 0) {
        return <div>Loading...</div>;
    }

    // Helper to get indices of previous, current, and next items
    const getPrevIndex = () => (currentIndex === 0 ? items.length - 1 : currentIndex - 1);
    const getNextIndex = () => (currentIndex === items.length - 1 ? 0 : currentIndex + 1);

    return (
        <div 
            className="carousel-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <button className="carousel-arrow left" onClick={handlePrev}>
                &#10094;
            </button>
            <div className="carousel-slide-container" ref={carouselRef}>
                <div className="carousel-multi-view">
                    <Card 
                        imageUrl={items[getPrevIndex()].imageUrl} 
                        description={items[getPrevIndex()].description}
                        isCurrent={false}
                    />
                    <TransitionGroup component={null}>
                        <CSSTransition
                            key={currentIndex}
                            timeout={500}
                            classNames={direction === 'next' ? 'slide' : 'slide-prev'}
                        >
                            <Card 
                                imageUrl={items[currentIndex].imageUrl} 
                                description={items[currentIndex].description}
                                isCurrent={true}
                            />
                        </CSSTransition>
                    </TransitionGroup>
                    <Card 
                        imageUrl={items[getNextIndex()].imageUrl} 
                        description={items[getNextIndex()].description}
                        isCurrent={false}
                    />
                </div>
            </div>
            <button className="carousel-arrow right" onClick={handleNext}>
                &#10095;
            </button>
        </div>
    );
};

export default Gallery;
