import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import { GetEventByCategoryService } from "../../services/EventService";
import { encodeId } from "../../utils/utils";
import moment from "moment";

function EventByCategory({ categoryId, categoryName, filter }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await GetEventByCategoryService(categoryId);
        if (Array.isArray(response)) {
          setEvents(response);
        } else {
          console.error("response is not an array", response);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [categoryId]);

  const formatDate = (dateString) => {
    return moment.utc(dateString).local().format('DD/MM/YYYY');
  };

  return (
    <div className="app">
      <div
        className="titleCategory"
        style={{
          display: "flex",
          margin: "auto",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ color: "white", marginLeft: "128px", fontSize: "2rem" }}>
            {categoryName}
          </h1>
        </div>
        <div style={{ marginRight: "9%" }}>
          <Link
            to="/search"
            state={{ category: filter }}
            className="see-more-button"
          >
            Xem thêm <i className="bi bi-chevron-right"></i>
          </Link>
        </div>
      </div>

      <div className="events-list">
        {events.slice(0, 4).map((event) => {
          const lowestPrice = event.tickettypes.reduce(
            (min, ticketType) => Math.min(min, ticketType.price),
            event.tickettypes[0]?.price || 0
          );

          const priceDisplay =
            lowestPrice === 0
              ? "Miễn phí"
              : `Từ ${lowestPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}`;

          return (
            <Link
              key={event.eventId}
              style={{ textDecoration: "none" }}
              to={`/event-detail/${encodeId(event.eventId)}`}
            >
              <EventCard
                image={event.themeImage}
                title={event.eventName}
                price={priceDisplay}
                date= {formatDate(event.startTime)}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default EventByCategory;
