import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import AnimatedWave from "../components/ui/animated-wave";
import "../styles/events.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const Events = () => {
  const { user } = useAuth();  // FIXED

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll(".event-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--x", x.toString());
        card.style.setProperty("--y", y.toString());
      });

      const buttons = document.querySelectorAll(".register-btn");
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        button.style.setProperty("--x", x.toString());
        button.style.setProperty("--y", y.toString());
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [events]);

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

      <nav className="events-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h3 className="navbar-logo">DevNest</h3>
          </div>

          <div className="navbar-right">
            <button
              className="nav-btn nav-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="nav-btn nav-btn-secondary"
              onClick={() => navigate("/anonymous-posts")}
            >
              Community
            </button>

            <button
              className="nav-btn nav-btn-secondary"
              onClick={() => navigate("/course-updates")}
            >
              Courses
            </button>

            {user?.role === "admin" && (
              <button
                className="nav-btn nav-btn-admin"
                onClick={() => navigate("/admin-events")}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="events-container">
        <h1 className="events-title">Latest Hackathons & Tech Events</h1>

        <input
          type="text"
          placeholder="Search by name, location, or platform..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p style={{ color: "white" }}>No matching events found...</p>
          ) : (
            filteredEvents.map((ev, idx) => (
              <EventCard key={idx} event={ev} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
