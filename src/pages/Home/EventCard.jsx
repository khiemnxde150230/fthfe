import React from 'react';

const EventCard = ({ image, title, price, date }) => {
  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />
      <div className="event-info">
        <h3>{title}</h3>
        <p className="event-price">{price}</p>
        <p className="event-date">
          <i class="bi bi-calendar2-event me-2"></i>
            {date}
        </p>
      </div>
    </div>
  );
};

export default EventCard;