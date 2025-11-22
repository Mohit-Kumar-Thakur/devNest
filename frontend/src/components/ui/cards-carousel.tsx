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

/* Glossy Card Styles */
.glossy-card {
  background: linear-gradient(
    135deg,
    rgba(7, 234, 230, 0.08) 0%,
    rgba(5, 184, 181, 0.06) 50%,
    rgba(7, 234, 230, 0.04) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(7, 234, 230, 0.2);
  border-radius: 16px;
  padding: 32px;
  height: 100%;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 1px 0 0 rgba(7, 234, 230, 0.3),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Glossy reflection overlay */
.glossy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 100%
  );
  border-radius: 16px 16px 0 0;
  pointer-events: none;
}

.glossy-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 20px 60px 0 rgba(7, 234, 230, 0.4),
    0 8px 32px 0 rgba(0, 0, 0, 0.5),
    inset 0 1px 0 0 rgba(7, 234, 230, 0.5),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.3);
  border-color: rgba(7, 234, 230, 0.4);
}

.card-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    rgba(7, 234, 230, 0.2) 0%,
    rgba(5, 184, 181, 0.15) 100%
  );
  border: 1px solid rgba(7, 234, 230, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(7, 234, 230, 0.2);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.card-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.post-item {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(7, 234, 230, 0.15);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(7, 234, 230, 0.25);
}

.post-title {
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
}

.post-time {
  color: rgba(7, 234, 230, 0.8);
  font-size: 12px;
  white-space: nowrap;
}

.post-content {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

.post-author {
  color: rgba(7, 234, 230, 0.9);
  font-size: 12px;
  margin: 8px 0 0 0;
}

/* Glossy Button */
.glossy-button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(7, 234, 230, 0.5);
  background: linear-gradient(
    135deg,
    rgba(7, 234, 230, 1) 0%,
    rgba(5, 184, 181, 0.95) 50%,
    rgba(7, 234, 230, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #000;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  display: block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(7, 234, 230, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

/* Top glossy reflection on button */
.glossy-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 100%
  );
  border-radius: 12px 12px 0 0;
  pointer-events: none;
}

/* Shine effect on button */
.glossy-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transition: left 0.5s ease;
  z-index: 1;
}

.glossy-button:hover::before {
  left: 100%;
}

.glossy-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(7, 234, 230, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    135deg,
    rgba(7, 234, 230, 1) 0%,
    rgba(5, 184, 181, 1) 50%,
    rgba(7, 234, 230, 0.95) 100%
  );
}

.glossy-button:active {
  transform: translateY(0) scale(0.98);
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
  .glossy-card {
    padding: 24px;
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
                <div className="glossy-card">
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div className="card-icon-wrapper">
                      <Icon style={{ width: '24px', height: '24px', color: '#07eae6' }} />
                    </div>
                    <h3 className="card-title">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="card-description" style={{ marginBottom: '24px' }}>
                    {card.description}
                  </p>

                  {/* Posts/Items */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {card.posts.map((post, idx) => (
                      <div key={idx} className="post-item">
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                          <h4 className="post-title">
                            {post.title}
                          </h4>
                          <span className="post-time">
                            {post.time}
                          </span>
                        </div>
                        <p className="post-content">
                          {post.content}
                        </p>
                        {post.author && (
                          <p className="post-author">
                            by {post.author}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <a href={card.href} className="glossy-button">
                    {card.buttonText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          className="cards-cascade-arrow cards-cascade-arrow-left"
          onClick={(e) => {
            e.stopPropagation();
            navigate('prev');
          }}
          aria-label="Previous card"
          style={{ color: '#07eae6', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#05b8b5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#07eae6'}
        >
          <ArrowLeftCircle size={40} />
        </button>
        <button
          className="cards-cascade-arrow cards-cascade-arrow-right"
          onClick={(e) => {
            e.stopPropagation();
            navigate('next');
          }}
          aria-label="Next card"
          style={{ color: '#07eae6', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#05b8b5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#07eae6'}
        >
          <ArrowRightCircle size={40} />
        </button>
      </div>
    </>
  );
};

export default CardsCarousel;