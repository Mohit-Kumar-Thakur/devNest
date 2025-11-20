import React from "react";

type EventType = {
  _id: string;
  title: string;
  date: string;
  organizer: string;
  location: string;
  image?: string;
};

type Props = {
  event: EventType;
  onEdit: (event: EventType) => void;
  onDelete: (id: string) => void;
};

const AdminEventCard: React.FC<Props> = ({ event, onEdit, onDelete }) => {
  return (
    <div
      className="admin-event-card"
      style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        boxShadow: "0px 0px 10px rgba(255,255,255,0.05)",
      }}
    >
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      )}

      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Organizer:</strong> {event.organizer}</p>
      <p><strong>Location:</strong> {event.location}</p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => onEdit(event)}
          style={{
            background: "#ffb400",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ✏ Edit
        </button>

        <button
          onClick={() => onDelete(event._id)}
          style={{
            background: "#ff4444",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white",
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

export default AdminEventCard;
