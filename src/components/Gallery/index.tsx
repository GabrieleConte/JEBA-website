import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './styles.css'; // Import the CSS file for styles and animations

interface CardProps {
    imageUrl: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, description }) => {
    return (
        <div className="card">
            <img src={imageUrl} alt="Display" />
            <p>{description}</p>
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
    // Base names of local files stored in public/assets
    const files: FileMapping[] = [
        { name: 'test' },
        { name: 'test2' },
        // Add more file base names as needed.
    ];

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    // Base path to your assets (public/assets)
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

    if (items.length === 0) {
        return <div>Loading...</div>;
    }

    // Choose animation classes based on direction
    const transitionClassNames = direction === 'next' ? 'slide' : 'slide-prev';

    return (
        <div className="carousel-container">
            <button className="carousel-arrow" onClick={handlePrev}>
                &#8592;
            </button>
            <div className="carousel-card-container">
                <TransitionGroup component={null}>
                    <CSSTransition key={currentIndex} timeout={500} classNames={transitionClassNames}>
                        <Card imageUrl={items[currentIndex].imageUrl} description={items[currentIndex].description} />
                    </CSSTransition>
                </TransitionGroup>
            </div>
            <button className="carousel-arrow" onClick={handleNext}>
                &#8594;
            </button>
        </div>
    );
};

export default Gallery;
