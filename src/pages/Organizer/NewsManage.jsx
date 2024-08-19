import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button as AntButton, Layout as AntLayout, Menu as AntMenu } from 'antd';
import Navbar from '../../component/Organizer/Navbar';
import CreateNewsForm from '../../component/Organizer/CreateNewsForm';
import NewsList from '../../component/Organizer/NewsList';
import EditNewsForm from '../../component/Organizer/EditNewsForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeId } from '../../utils/utils';

const { Sider: AntSider, Content: AntContent } = AntLayout;

const CustomButton = styled(AntButton)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

const Sider = styled(AntSider)`
  background-color: #EC6C21;
`;

const Menu = styled(AntMenu)`
  .ant-menu-item-selected {
    background-color: #d55a1a !important;
    color: white !important;
  }
`;

const Content = styled(AntContent)`
  background-color: #fff;
  padding: 24px;
  margin: 0;
  min-height: 280px;
`;

const NewsManage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('1');
  const [newsId, setNewsId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const editId = params.get('edit');
    if (editId) {
      setSelectedKey('3');
      setNewsId(decodeId(editId));
    } else {
      setSelectedKey('1');
      setNewsId(null);
    }
  }, [search]);

  const handleMenuClick = (e) => {
    const key = e.key;
    setSelectedKey(key);
    
    if (key === '1') {
      navigate('/organizer/manage-news');
    } else if (key === '2') {
      navigate('/organizer/manage-news');
    } else if (key === '3') {
      navigate(`/organizer/manage-news?edit=${newsId}`);
    }
  };

  return (
    <>
      <Navbar />
      <AntLayout style={{ minHeight: '100vh' }}>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="1">Tin tức đã tạo</Menu.Item>
            <Menu.Item key="2">Tạo tin tức</Menu.Item>
            {/* <Menu.Item key="3">Chỉnh sửa tin tức</Menu.Item> */}
          </Menu>
        </Sider>
        <AntLayout style={{ padding: '0 24px 24px' }}>
          <Content>
            {selectedKey === '1' && <NewsList />}
            {selectedKey === '2' && <CreateNewsForm />}
            {selectedKey === '3' && newsId && <EditNewsForm newsId={newsId} />}
          </Content>
        </AntLayout>
      </AntLayout>
    </>
  );
};

export default NewsManage;