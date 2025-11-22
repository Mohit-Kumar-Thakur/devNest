import React, { useEffect, useState } from "react";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../api/Events";
import "../styles/AdminEvents.css";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    organizer: "",
    date: "",
    location: "",
    description: "",
    registrationLink: "",
    image: "",
    platform: "",
  });

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    getEvents().then((data) => setEvents(data));
  };

  const handleAdd = async () => {
    if (!form.title || !form.date) {
      alert("Please fill in at least the title and date!");
      return;
    }

    const saved = await addEvent(form);
    setEvents([...events, saved]);

    setForm({
      title: "",
      organizer: "",
      date: "",
      location: "",
      description: "",
      registrationLink: "",
      image: "",
      platform: "",
    });
  };

  const openEditModal = (event) => {
    setEditing(event);
    setForm({ ...event });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const updated = await updateEvent(editing._id, form);
    setEvents(events.map((e) => (e._id === updated._id ? updated : e)));

    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
    }
  };

  return (
    <div className="admin-page-wrapper">
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-navbar-left">
            <h1 className="admin-navbar-logo">devNest Admin</h1>
            <span className="admin-badge">Admin Panel</span>
          </div>
          
          <div className="admin-navbar-right">
            <a href="/dashboard" className="admin-nav-btn admin-nav-btn-primary">
              <svg className="admin-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </a>
            
            <a href="/course-updates" className="admin-nav-btn admin-nav-btn-secondary">
              <svg className="admin-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Course Updates</span>
            </a>
            
            <a href="/events" className="admin-nav-btn admin-nav-btn-orange">
              <svg className="admin-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Events</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="admin-container">
        <h1 className="admin-title">Event Management Dashboard</h1>

        <div className="add-event-form">
          <h2 className="form-title">Create New Event</h2>

          <div className="form-grid">
            {Object.keys(form).map((field) =>
              field !== "_id" && field !== "__v" ? (
                <input
                  key={field}
                  className="admin-input"
                  placeholder={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              ) : null
            )}
          </div>

          <button className="add-event-btn" onClick={handleAdd}>
            <span>➕</span>
            <span>Add Event</span>
          </button>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No events yet</div>
            <div className="empty-state-subtext">
              Create your first event using the form above
            </div>
          </div>
        ) : (
          <div className="admin-events-grid">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="admin-event-card"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
                }}
              >
                {ev.image && (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="admin-card-image"
                  />
                )}

                <h3 className="admin-card-title">{ev.title}</h3>

                <div className="admin-card-info">
                  <strong>📅 Date:</strong> {ev.date}
                </div>

                {ev.organizer && (
                  <div className="admin-card-info">
                    <strong>👤 Organizer:</strong> {ev.organizer}
                  </div>
                )}

                {ev.location && (
                  <div className="admin-card-info">
                    <strong>📍 Location:</strong> {ev.location}
                  </div>
                )}

                {ev.platform && (
                  <div className="admin-card-info">
                    <strong>💻 Platform:</strong> {ev.platform}
                  </div>
                )}

                {ev.description && (
                  <div className="admin-card-info" style={{ display: "block", marginTop: "10px" }}>
                    <strong>📝 Description:</strong>
                    <div style={{ marginTop: "5px", lineHeight: "1.5" }}>
                      {ev.description}
                    </div>
                  </div>
                )}

                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(ev)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(ev._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2 className="modal-title">Edit Event</h2>

              {Object.keys(form).map((field) =>
                !["_id", "__v"].includes(field) ? (
                  <input
                    key={field}
                    className="modal-input"
                    placeholder={field}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                ) : null
              )}

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="save-btn" onClick={handleUpdate}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;