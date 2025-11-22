'use client';

import React, { useState, useCallback } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Post {
  title: string;
  time: string;
  content: string;
  author?: string;
}

interface CardData {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  posts: Post[];
  href: string;
}

interface CardsCarouselProps {
  cards: CardData[];
}

const EMBEDDED_CSS = `
.cards-cascade-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 20;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  height: 650px;
  padding: 0 100px;
}

.cards-cascade-slides {
  position: relative;
  height: 100%;
}

.cards-cascade-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%) scale(0.8);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  z-index: 1;
  cursor: grab;
  width: 90%;
  max-width: 400px;
}

.cards-cascade-item.now {
  cursor: default;
  left: 50%;
  transform: translateY(-50%) translateX(-50%) scale(1);
  opacity: 1;
  z-index: 5;
}

.cards-cascade-item.next {
  left: 50%;
  transform: translateY(-50%) translateX(-160%) scale(0.75);
  opacity: 0.7;
  z-index: 4;
}

.cards-cascade-item.prev {
  left: 50%;
  transform: translateY(-50%) translateX(60%) scale(0.75);
  opacity: 0.7;
  z-index: 4;
}

.cards-cascade-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  cursor: pointer;
  z-index: 6;
  transform: translate(0, -50%);
  width: 50px;
  height: 50px;
  transition: all 0.3s ease;
}

@media screen and (max-width: 768px) {
  .cards-cascade-container {
    height: 550px;
  }
  .cards-cascade-item {
    max-width: 85vw;
  }
  .cards-cascade-arrow-left {
    left: 10px;
  }
  .cards-cascade-arrow-right {
    right: 10px;
  }
  .cards-cascade-item.next {
    transform: translateY(-50%) translateX(-140%) scale(0.7);
  }
  .cards-cascade-item.prev {
    transform: translateY(-50%) translateX(40%) scale(0.7);
  }
}

@media screen and (min-width: 769px) {
  .cards-cascade-arrow-left {
    left: 20px;
  }
  .cards-cascade-arrow-right {
    right: 20px;
  }
}
`;

const getCardClasses = (
  index: number,
  activeIndex: number,
  total: number
): string => {
  const diff = index - activeIndex;
  if (diff === 0) return 'now';
  if (diff === 1 || diff === -total + 1) return 'next';
  if (diff === -1 || diff === total - 1) return 'prev';
  return '';
};

export const CardsCarousel: React.FC<CardsCarouselProps> = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const swipeThreshold = 50;

  const navigate = useCallback((direction: 'next' | 'prev') => {
    setActiveIndex((current) => {
      if (direction === 'next') {
        return (current + 1) % cards.length;
      } else {
        return (current - 1 + cards.length) % cards.length;
      }
    });
  }, [cards.length]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging) return;
    const distance = clientX - startX;
    if (Math.abs(distance) > swipeThreshold) {
      if (distance < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    setIsDragging(false);
    setStartX(0);
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => handleEnd(e.clientX);
  const onTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) =>
    handleEnd(e.changedTouches[0].clientX);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EMBEDDED_CSS }} />
      <div
        className="cards-cascade-container"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cards-cascade-slides">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`cards-cascade-item ${getCardClasses(
                  index,
                  activeIndex,
                  cards.length
                )}`}
              >
                <div className="bg-card border border-border rounded-2xl p-8 h-full shadow-xl hover:shadow-2xl transition-all flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Posts/Items */}
                  <div className="flex-1 space-y-4 mb-6">
                    {card.posts.map((post, idx) => (
                      <div
                        key={idx}
                        className="bg-muted/30 rounded-lg p-4 border border-border/50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground text-sm">
                            {post.title}
                          </h4>
                          <span className="text-muted-foreground text-xs whitespace-nowrap">
                            {post.time}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {post.content}
                        </p>
                        {post.author && (
                          <p className="text-primary text-xs mt-2">
                            by {post.author}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <a
                    href={card.href}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center"
                  >
                    {card.buttonText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          className="cards-cascade-arrow cards-cascade-arrow-left text-primary hover:text-primary/70 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate('prev');
          }}
          aria-label="Previous card"
        >
          <ArrowLeftCircle size={40} />
        </button>
        <button
          className="cards-cascade-arrow cards-cascade-arrow-right text-primary hover:text-primary/70 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate('next');
          }}
          aria-label="Next card"
        >
          <ArrowRightCircle size={40} />
        </button>
      </div>
    </>
  );
};

export default CardsCarousel;