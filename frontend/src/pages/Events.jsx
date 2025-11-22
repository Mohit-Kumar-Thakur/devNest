import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AnimatedWave from "../components/ui/animated-wave";
import "../styles/events.css";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, []);

  // 🌟 Glow effect - Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Update glow position for all event cards
      const cards = document.querySelectorAll('.event-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--x', x.toString());
        card.style.setProperty('--y', y.toString());
      });

      // Update glow position for all register buttons
      const buttons = document.querySelectorAll('.register-btn');
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        button.style.setProperty('--x', x.toString());
        button.style.setProperty('--y', y.toString());
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [events]);

  // SEARCH FILTER
  const filteredEvents = events.filter((ev) => {
    const q = search.toLowerCase();

    return (
      ev.title?.toLowerCase().includes(q) ||
      ev.location?.toLowerCase().includes(q) ||
      ev.platform?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="events-page-wrapper">
      {/* 🌊 Animated Wave Background */}
      <AnimatedWave
        className="wave-background"
        speed={0.015}
        amplitude={30}
        smoothness={300}
        wireframe={true}
        waveColor="#07eae6"
        opacity={0.6}
        mouseInteraction={true}
        quality="medium"
        fov={60}
        waveOffsetY={-300}
        waveRotation={29.8}
        cameraDistance={-1000}
        autoDetectBackground={false}
        backgroundColor="transparent"
      />

      {/* 🎯 Navigation Bar */}
      <nav className="events-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h3 className="navbar-logo">DevNest</h3>
          </div>
          
          <div className="navbar-right">
            <button 
              className="nav-btn nav-btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>

            <button 
              className="nav-btn nav-btn-secondary"
              onClick={() => navigate('/anonymous-posts')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Community
            </button>

            <button 
              className="nav-btn nav-btn-secondary"
              onClick={() => navigate('/course-updates')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses
            </button>

            <button 
              className="nav-btn nav-btn-admin"
              onClick={() => navigate('/admin-events')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Content Layer */}
      <div className="events-container">
        <h1 className="events-title">Latest Hackathons & Tech Events</h1>

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name, location, or platform..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GRID */}
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p style={{ color: "white" }}>No matching events found...</p>
          ) : (
            filteredEvents.map((ev, idx) => <EventCard key={idx} event={ev} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;