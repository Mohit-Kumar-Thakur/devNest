import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events/all")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, []);
  
  

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
    <div className="events-container">
      <h1 className="events-title">Latest Hackathons & Tech Events</h1>
      <button
  onClick={() => (window.location.href = "/admin-events")}
  className="admin-btn"
  style={{
    padding: "10px 20px",
    marginBottom: "20px",
    background: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Go to Admin Panel
</button>


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
  );
};

export default Events;