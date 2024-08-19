import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../component/Organizer/Navbar";
import { UserContext } from '../../context/UserContext';
import { Input, Segmented, Table, Button } from 'antd';
import { GetNewsByAccountService } from '../../services/NewsService';
import Footer from '../../component/Footer';
import { encodeId } from '../../utils/utils';
import moment from 'moment/moment';

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

const NewsList = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('TẤT CẢ');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user.accountId) {
                console.error('accountId', user.accountId);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await GetNewsByAccountService(user.accountId);
                console.log('response', response);

                if (!Array.isArray(response)) {
                    console.error('response is not an array', response);
                    setNews([]);
                    setFilteredNews([]);
                } else {
                    setNews(response);
                    setFilteredNews(response);
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
        filterNews(filter, search);
    }, [news, filter, search]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        filterNews(filter, value);
    };

    const handleSegmentedChange = (value) => {
        setFilter(value);
        filterNews(value, search);
    };

    const filterNews = (filter, search) => {
        let filtered = news;
        if (filter === 'CHỜ DUYỆT') {
            filtered = filtered.filter(newsItem => newsItem.status === 'Chờ duyệt');
        } else if (filter === 'ĐÃ DUYỆT') {
            filtered = filtered.filter(newsItem => newsItem.status === 'Đã duyệt');
        }

        if (search) {
            filtered = filtered.filter(newsItem => newsItem.title.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredNews(filtered);
    };

    const handleEditClick = (newsId) => {
        navigate(`/organizer/manage-news?edit=${encodeId(newsId)}`);
    };

    const columns = [
        {
            title: 'Ảnh bìa',
            dataIndex: 'coverImage',
            key: 'coverImage',
            render: (text) => <img src={text} alt="CoverImage" style={{ width: '120px', height: 'auto', borderRadius: '10px' }} />,
            responsive: ['md'],
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Phụ đề',
            dataIndex: 'subtitle',
            key: 'subtitle',
            responsive: ['md'],
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text) => {
                return moment.utc(text).local().format('DD/MM/YYYY HH:mm:ss');
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <CustomButton type="primary" onClick={() => handleEditClick(record.newsId)}>
                    <i className="bi bi-pen"></i>
                </CustomButton>
            ),
        },
    ];

    // const expandedRowRender = (record) => {
    //     return (
    //         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    //             <img
    //                 src={record.coverImage}
    //                 alt="Cover Image"
    //                 style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
    //             />
    //             <p><strong>Tiêu đề:</strong> {record.title}</p>
    //             <p><strong>Tiêu đề phụ:</strong> {record.subtitle}</p>
    //             <div>
    //                 <p><strong>Nội dung:</strong></p>
    //                 <div dangerouslySetInnerHTML={{ __html: record.content }} />
    //             </div>
    //             <p><strong>Ngày tạo:</strong> {new Date(record.createDate).toLocaleString("vi")}</p>
    //         </div>
    //     );
    // };


    return (
        <>
            <div>
                <div className="row align-items-center mb-4">
                    <div className="col-md-8 mb-3 mb-md-0">
                        <CustomSearch
                            placeholder="Tìm kiếm tin tức"
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="col-md-4">
                        <CustomSegmented
                            options={['TẤT CẢ', 'ĐÃ DUYỆT', 'CHỜ DUYỆT']}
                            style={{ width: '100%' }}
                            onChange={handleSegmentedChange}
                            value={filter}
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredNews}
                    rowKey="newsId"
                    loading={loading}
                    // expandable={{ expandedRowRender }}
                    pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15']}}
                />
            </div>
        </>
    );
};

export default NewsList;