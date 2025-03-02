import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import './styles.css';

interface CardProps {
    imageUrl: string;
    description: string;
}

interface CardProps {
    imageUrl: string;
    description: string;
}
const Card: React.FC<CardProps> = ({ imageUrl, description }) => {
    return (
        <div className="card">
            <div className="card-content">
                <img src={imageUrl} alt="Display" className="card-image" />
                <div className="card-description">
                    <ReactMarkdown
                        remarkPlugins={[remarkBreaks]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {description}
                    </ReactMarkdown>
                </div>
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
        { name: 'test' },
        { name: 'test2' },
    ];

    const [items, setItems] = useState<GalleryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

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

    return (
        <div className="carousel-container">
            <button className="carousel-arrow left" onClick={handlePrev}>
                &#10094;
            </button>
            <div className="carousel-card-container">
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={currentIndex}
                        timeout={500}
                        classNames={direction === 'next' ? 'slide' : 'slide-prev'}
                    >
                        <Card imageUrl={items[currentIndex].imageUrl} description={items[currentIndex].description} />
                    </CSSTransition>
                </TransitionGroup>
            </div>
            <button className="carousel-arrow right" onClick={handleNext}>
                &#10095;
            </button>
        </div>
    );
};

export default Gallery;
