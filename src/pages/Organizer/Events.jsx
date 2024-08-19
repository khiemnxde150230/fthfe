import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Navbar from "../../component/Organizer/Navbar";
import { UserContext } from '../../context/UserContext';
import { Input, Segmented, Table, Button } from 'antd';
//import { SearchOutlined } from '@ant-design/icons';
import { GetEventsByAccountService } from '../../services/EventService';
import Footer from '../../component/Footer';
import { encodeId } from '../../utils/utils';
import moment from 'moment';


const CustomSearch = styled(Input)`
  .ant-btn-primary {
    background-color: #EC6C21;
    border-color: #EC6C21;

    &:hover,
    &:focus {
      background-color: #EC6C21 !important;
      border-color: #EC6C21 !important;
      opacity: 0.8;
    }
  }
`;

const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

const CustomSegmented = styled(Segmented)`
  .ant-segmented-item {
    &:hover {
      opacity: 0.8;
      color: white;
    }
    &.ant-segmented-item-selected {
      background-color: #EC6C21;
      color: white;
    }
  }
`;

const Events = () => {
    const { user } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('TẤT CẢ');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user.accountId) {
                console.error('accountid by context', user.accountId);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await GetEventsByAccountService(user.accountId);
                console.error('accountid by context loading false', user.accountId);
                console.log('response', response);

                if (!Array.isArray(response)) {
                    console.error('respone is not an array', response);
                    setEvents([]);
                    setFilteredEvents([]);
                } else {
                    setEvents(response);
                    setFilteredEvents(response);
                }
            } catch (error) {
                console.error("fetching data error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.accountId]);

    useEffect(() => {
        filterEvents(filter, search);
    }, [events, filter, search]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        filterEvents(filter, value);
    };

    const handleSegmentedChange = (value) => {
        setFilter(value);
        filterEvents(value, search);
    };

    const filterEvents = (filter, search) => {
        const now = new Date();
        let filtered = events;

        if (filter === 'SẮP DIỄN RA') {
            filtered = filtered.filter(event => new Date(event.startTime) > now && event.status === 'Đã duyệt');
        } else if (filter === 'ĐÃ QUA') {
            filtered = filtered.filter(event => new Date(event.endTime) < now && event.status === 'Đã duyệt');
        } else if (filter === 'CHỜ DUYỆT') {
            filtered = filtered.filter(event => event.status === 'Chờ duyệt');
        } else if (filter === 'NHÁP') {
            filtered = filtered.filter(event => event.status === 'Nháp');
        }

        if (search) {
            filtered = filtered.filter(event => event.eventName.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredEvents(filtered);
    };

    const formatDateTime = (dateString) => {
        return moment.utc(dateString).local().format('DD/MM/YYYY HH:mm');
    };

    const columns = [
        {
            title: 'Tên sự kiện',
            dataIndex: 'eventName',
            key: 'eventName',
        },
        {
            title: 'Ảnh nền sự kiện',
            dataIndex: 'themeImage',
            key: 'themeImage',
            render: (text) => <img src={text} alt="ThemeImage" style={{ width: '120px', height: 'auto', borderRadius: '10px' }} />,
            responsive: ['md'],
        },
        {
            title: 'Loại sự kiện',
            dataIndex: 'categoryName',
            key: 'categoryName',
            responsive: ['md'],
        },
        {
            title: 'Tên địa điểm',
            dataIndex: 'location',
            key: 'location',
            responsive: ['md'],
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text) => formatDateTime(text),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text) => formatDateTime(text),
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',

        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => {
                const encodedId = encodeId(record.eventId);
                return (
                    <>
                        <CustomButton type="primary" href={`/organizer/edit-event/${encodedId}`} style={{ marginRight: '8px' }}>
                            <i className="bi bi-pen"></i>
                        </CustomButton>
                        {record.status === 'Đã duyệt' && (
                            <CustomButton type="primary" href={`/event-statistics/${encodedId}`}>
                                <i className="bi bi-clipboard-data"></i>
                            </CustomButton>
                        )}
                    </>

                );
            },
        },

    ];

    return (
        <>
            <Navbar />
            <div className="p-4 bg-light">
                <div className="row align-items-center mb-4">
                    <div className="col-md-8 mb-3 mb-md-0">
                        <CustomSearch
                            placeholder="Tìm kiếm sự kiện"
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-4">
                        <CustomSegmented
                            options={['TẤT CẢ', 'SẮP DIỄN RA', 'ĐÃ QUA', 'CHỜ DUYỆT', 'NHÁP']}
                            style={{ width: '100%' }}
                            onChange={handleSegmentedChange}
                            value={filter}
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredEvents}
                    rowKey="eventId"
                    loading={loading}
                    pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15']}}
                />
            </div>
            <Footer />
        </>
    );
};

export default Events;