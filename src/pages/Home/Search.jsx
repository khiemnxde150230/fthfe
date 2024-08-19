import React, { useState, useEffect } from "react";
import styles from "../../assets/css/Search.module.css";
import bgSrc from "../../assets/images/events/bg-stage.jpg";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { SearchEventByContainTiTile } from "../../services/EventService";
import { Link, useLocation } from "react-router-dom";
import { encodeId } from "../../utils/utils";
import EventCard from "./EventCard";
import { GetEventsUserService } from "../../services/EventService";
import { SearchEventByFilter } from "../../services/EventService";
import moment from "moment";

const Search = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    price: "",
    category: {
      entertaiment: false,
      education: false,
      workshop: false,
      other: false,
    },
  });

  const [selectedFilters, setSelectedFilters] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (location.state?.category) {
          const categoryKey = location.state.category;
          setFilters((prevFilters) => ({
            ...prevFilters,
            category: {
              ...prevFilters.category,
              [categoryKey]: true,
            },
          }));

          const selected = [];
          switch (categoryKey) {
            case "entertaiment":
              selected.push("Nghệ thuật");
              break;
            case "education":
              selected.push("Giáo dục");
              break;
            case "workshop":
              selected.push("Workshop");
              break;
            case "other":
              selected.push("Khác");
              break;
          }

          setSelectedFilters(selected);
          const result = await SearchEventByFilter(selected.join(", "));
          if (result.status === 200) {
            setEvents(result.resultFilter);
          }
        } else {
          const response = await GetEventsUserService();
          if (response) {
            setEvents(response.result);
          } else {
            console.error("response is not an array", response);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [location.state]);

  const handleCloseFilter = () => setShowFilter(false);
  const handleShowFilter = () => setShowFilter(true);

  const handleFilterChange = (type, key) => {
    if (type === "price") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        price: key,
      }));
    } else if (type === "category") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        category: {
          ...prevFilters.category,
          [key]: !prevFilters.category[key],
        },
      }));
    }
  };
  
  const resetFilters = async () => {
    setFilters({
      price: "",
      category: {
        entertaiment: false,
        education: false,
        workshop: false,
        other: false,
      },
    });
    const result = await GetEventsUserService();
    if(result)
    {
      setEvents(result.result);
    }
    setSelectedFilters([]);
  };

  const applyFilters = async () => {
    const selected = [];

    if (filters.price) {
      selected.push(
        filters.price === "all"
          ? "Tất cả"
          : filters.price === "free"
          ? "Miễn phí"
          : "Có phí"
      );
    }

    Object.keys(filters.category).forEach((key) => {
      if (filters.category[key]) {
        selected.push(
          key === "music"
            ? "Nghệ thuật"
            : key === "stage"
            ? "Giáo dục"
            : key === "sports"
            ? "Workshop"
            : "Khác"
        );
      }
    });
    const selectedFiltersString = selected.join(", ");
    setSelectedFilters(selected);
    const result = await SearchEventByFilter(selectedFiltersString);
    if(result.status === 200)
    {
      setEvents(result.resultFilter);
    } 
    else 
    {
      setEvents([]);
    }
    handleCloseFilter();
  };

  const handleSearchChange = async (event) => {
    setSearchString(event.target.value);
  };

  const handleSearch = async () => {
    if (searchString != "") {
      const result = await SearchEventByContainTiTile(searchString);
      if (result.status === 200) {
        setEvents(result.listEventAfterString);
      }
    } else {
      const resultIfNull = await GetEventsUserService();
      if (resultIfNull) {
        setEvents(resultIfNull);
      }
    }
  };

  const formatDate = (dateString) => {
    return moment.utc(dateString).local().format('DD/MM/YYYY');
  };

  return (
    <>
      <Header />
      <div className={styles.containerSearch}>
        <div className={styles.searchBackground}>
          <img src={bgSrc} alt="Concert crowd" />
        </div>
        <div className={styles.searchContent}>
          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Sự kiện bạn muốn tìm kiếm?"
              className={styles.searchInput}
              value={searchString}
              onChange={handleSearchChange}
            />
            <button
              className={styles.searchButton}
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchFilters}>
          <span style={{ color: "white", marginRight: "10px" }}>
            Kết quả tìm kiếm:
          </span>
          {selectedFilters.map((filter, index) => (
            <button
              key={index}
              className={`${styles.filterButton} ${styles.filterButtonOutline}`}
            >
              {filter}
            </button>
          ))}
          <button
            className={`${styles.filterButton} ${styles.filterButtonOutline}`}
            onClick={resetFilters}
          >
            Thiết lập lại
          </button>
          <button
            className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            onClick={handleShowFilter}
            style={{ marginLeft: "auto" }}
          >
            Bộ lọc
          </button>
        </div>
      </div>
      <div className="app">
        <div className="container">
          <div className="row justify-content-center gx-3">
            {events.map((event, index) => {
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
                <div
                  key={event.eventId}
                  className="col-12 col-md-6 col-lg-3 mb-4"
                >
                  <Link
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showFilter && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <span className={styles.closeButton} onClick={handleCloseFilter}>
                &times;
              </span>
              <h2>Bộ lọc</h2>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Giá tiền</label>
                {["all", "free", "paid"].map((price) => (
                  <div key={price} className={styles.formCheck}>
                    <input
                      type="radio"
                      id={`price-${price}`}
                      name="price"
                      value={price}
                      checked={filters.price === price}
                      onChange={() => handleFilterChange("price", price)}
                      className={styles.formCheckInput}
                    />
                    <label
                      htmlFor={`price-${price}`}
                      className={styles.formCheckLabel}
                    >
                      {price === "all"
                        ? "Tất cả"
                        : price === "free"
                        ? "Miễn phí"
                        : "Có phí"}
                    </label>
                  </div>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Thể loại</label>
                {["music", "stage", "sports", "other"].map((category) => (
                  <div key={category} className={styles.formCheck}>
                    <input
                      type="checkbox"
                      id={`cat-${category}`}
                      checked={filters.category[category]}
                      onChange={() => handleFilterChange("category", category)}
                      className={styles.formCheckInput}
                    />
                    <label
                      htmlFor={`cat-${category}`}
                      className={styles.formCheckLabel}
                    >
                      {category === "music"
                        ? "Nghệ thuật"
                        : category === "stage"
                        ? "Giáo dục"
                        : category === "sports"
                        ? "Workshop"
                        : "Khác"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={resetFilters}
                className={`${styles.filterButton} ${styles.filterButtonOutline}`}
              >
                Thiết lập lại
              </button>
              <button
                onClick={applyFilters}
                className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Search;