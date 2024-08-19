import React, { useEffect, useState, useContext } from 'react';
import { Card, List, Typography, Collapse, Input, Divider } from 'antd';
import { GetCheckinHistoryService } from '../../services/StaffService';
import { UserContext } from "../../context/UserContext";
import moment from 'moment';
import NavbarStaff from '../../component/Staff/NavbarStaff';

const { Title } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const CheckinHistory = () => {
    const { user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const result = await GetCheckinHistoryService(user.accountId);
                    setData(result);
                    setFilteredData(result);
                }
            } catch (error) {
                console.error('Error fetching check-in history:', error);
            }
        };

        fetchData();
    }, [user.accountId]);

    // Filter data based on search input
    const handleSearch = value => {
        setSearchValue(value);
        const filtered = data.map(event => ({
            ...event,
            checkins: event.checkins.filter(checkin =>
                checkin.ticketId.toString().includes(value)
            )
        }));
        setFilteredData(filtered);
    };

    const formatDateTime = (date) => {
        if (!date) return '';
        return moment.utc(date).local().format('DD/MM/YYYY HH:mm:ss');
      };

    return (
        <>
        <NavbarStaff />
        <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <Search
                placeholder="Nhập mã vé"
                value={searchValue}
                onChange={e => handleSearch(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            {filteredData.map(event => (
                <Card
                    key={event.eventId}
                    style={{ marginBottom: '16px' }}
                    title={<Title level={4} style={{ fontSize: '16px' }}>{event.eventName}</Title>}
                    extra={moment.utc(event.eventDate).local().format('DD/MM/YYYY')}
                >
                    <Collapse>
                        {event.checkins.length > 0 ? (
                            event.checkins.map(checkin => (
                                <Panel
                                    header={`Mã vé: ${checkin.ticketId} - ${checkin.fullName}`}
                                    key={checkin.ticketId}
                                    style={{ marginBottom: '8px' }}
                                >
                                    <List
                                        dataSource={[
                                            { label: 'Giờ checkin', value: formatDateTime(checkin.checkInDate) },
                                            { label: 'Loại vé', value: checkin.typeName },
                                            { label: 'Email', value: checkin.email },
                                            { label: 'Điện thoại', value: checkin.phone },
                                            { label: 'Số lượng', value: checkin.quantity },
                                        ]}
                                        renderItem={item => (
                                            <List.Item style={{ padding: 0 }}>
                                                <strong>{item.label}:</strong> {item.value}
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            ))
                        ) : (
                            <Panel key="no-results" header="Không tìm thấy kết quả" style={{ marginBottom: '8px' }}>
                                <p>Không tìm thấy kết quả</p>
                            </Panel>
                        )}
                    </Collapse>
                </Card>
            ))}
        </div>
        </>
    );
};

export default CheckinHistory;
