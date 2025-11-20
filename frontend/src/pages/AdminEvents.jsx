import React, { useEffect, useState } from "react";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../api/Events";
import AdminEventCard from "../components/AdminEventCard";

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
    platform: "",   // 👈 now user can type platform manually
  });

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    getEvents().then((data) => setEvents(data));
  };

  // ➤ Add New Event
  const handleAdd = async () => {
    const saved = await addEvent(form);
    setEvents([...events, saved]);

    // Reset form
    setForm({
      title: "",
      organizer: "",
      date: "",
      location: "",
      description: "",
      registrationLink: "",
      image: "",
      platform: "",   // 👈 reset empty
    });
  };

  // ➤ Start Editing
  const openEditModal = (event) => {
    setEditing(event);
    setForm({ ...event });
    setShowModal(true);
  };

  // ➤ Save Edits
  const handleUpdate = async () => {
    const updated = await updateEvent(editing._id, form);
    setEvents(events.map((e) => (e._id === updated._id ? updated : e)));

    setShowModal(false);
    setEditing(null);
  };

  // ➤ Delete Event
  const handleDelete = async (id) => {
    await deleteEvent(id);
    setEvents(events.filter((e) => e._id !== id));
  };

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Event Manager</h1>

      {/* 🔥 Add Event Form */}
      <div
        style={{
          background: "#1b1b1b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Add New Event</h2>

        <div style={{ display: "grid", gap: "10px" }}>
          {Object.keys(form).map(
            (field) =>
              field !== "_id" &&
              field !== "__v" && (
                <input
                  key={field}
                  placeholder={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#333",
                    color: "white",
                  }}
                />
              )
          )}
        </div>

        <button
          onClick={handleAdd}
          style={{
            background: "#00c853",
            border: "none",
            marginTop: "15px",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white",
          }}
        >
          ➕ Add Event
        </button>
      </div>

      {/* 🔥 Events Grid */}
      <div
        className="events-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {events.map((ev) => (
          <AdminEventCard
            key={ev._id}
            event={ev}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 🔥 Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#1e1e1e",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
            }}
          >
            <h2>Edit Event</h2>

            {Object.keys(form).map(
              (field) =>
                !["_id", "__v"].includes(field) && (
                  <input
                    key={field}
                    placeholder={field}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "6px",
                      border: "none",
                      background: "#333",
                      color: "white",
                    }}
                  />
                )
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#777",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  color: "white",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                style={{
                  background: "#ffb400",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;