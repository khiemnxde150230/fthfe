import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GetUpcomingEventService } from "../../services/EventService";
import { Link } from "react-router-dom";
import { encodeId } from "../../utils/utils";
import moment from "moment";

function Upcoming() {
  const [events, setEvents] = useState([]);
  const [checkUpComing, setCheckUpComing] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await GetUpcomingEventService();
        if (Array.isArray(allEvents)) {
          setEvents(allEvents);
          if (allEvents.length == 1) {
            setCheckUpComing(true);
          }
        } else {
          console.error("Is not array", allEvents);
          setEvents([]);
        }
      } catch (error) {
        console.error("Fetching error", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const formatDateTime = (dateString) => {
    return moment.utc(dateString).local().format('DD/MM/YYYY HH:mm');
  };

  return (
    <>
      <section className="event spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2 style={{ color: "white", marginLeft: "7px" }}>
                  Sắp diễn ra
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {checkUpComing ? (
              <>
              {events.map((event) => (
                <div
                  className="col-lg-4 col-sm-10"
                  style={{ margin: "0 10px" }}
                  key={event.eventId}
                >
                  <div className="event__item" style={{ background: "white" }}>
                    <div
                      className="event__item__pic set-bg"
                      style={{ backgroundImage: `url(${event.themeImage})` }}
                    >
                      <div className="tag-date">
                        <span>
                          {formatDateTime(event.startTime)}
                        </span>
                      </div>
                    </div>
                    <div className="event__item__text">
                      <Link
                        key={event.eventId}
                        style={{ textDecoration: "none" }}
                        to={`/event-detail/${encodeId(event.eventId)}`}
                      >
                        <h4>{event.eventName}</h4>
                      </Link>
                      <p>
                        <i className="custom-icon bi-geo-alt me-2"></i>
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </>
            ) : (
              <>
              <Slider {...settings}>
              {events.map((event) => (
                <div
                  className="col-lg-4 col-sm-10"
                  style={{ margin: "0 10px" }}
                  key={event.eventId}
                >
                  <div className="event__item" style={{ background: "white" }}>
                    <div
                      className="event__item__pic set-bg"
                      style={{ backgroundImage: `url(${event.themeImage})` }}
                    >
                      <div className="tag-date">
                        <span>
                          {formatDateTime(event.startTime)}
                        </span>
                      </div>
                    </div>
                    <div className="event__item__text">
                      <Link
                        key={event.eventId}
                        style={{ textDecoration: "none" }}
                        to={`/event-detail/${encodeId(event.eventId)}`}
                      >
                        <h4>{event.eventName}</h4>
                      </Link>
                      <p>
                        <i className="custom-icon bi-geo-alt me-2"></i>
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
              </>
            )}
            
          </div>
        </div>
      </section>
    </>
  );
}

export default Upcoming;
