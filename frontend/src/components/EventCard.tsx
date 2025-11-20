import React from "react";

type EventType = {
  title: string;
  date: string;
  description: string;
  image?: string;
  location?: string;
  platform?: string;
  registrationLink?: string;
};

type Props = {
  event: EventType;
};

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="event-card">
      {event.image && (
        <img src={event.image} alt={event.title} className="event-image" />
      )}

      <h2>{event.title}</h2>

      <p><strong>Date:</strong> {event.date}</p>
      {event.location && <p><strong>Location:</strong> {event.location}</p>}
      {event.platform && <p className="platform-tag">{event.platform}</p>}

      <p className="desc">{event.description}</p>

      {event.registrationLink && (
        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
          <button className="register-btn">Check Event</button>
        </a>
      )}
    </div>
  );
};

export default EventCard;
