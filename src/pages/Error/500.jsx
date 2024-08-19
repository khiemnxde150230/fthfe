import React from 'react';
import { Button, Result } from 'antd';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';


const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

export default function Status500() {
  const { token, user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleBackClick = () => {
    if (!user) {
      navigate('/');
      return;
    }

    switch (user.roleId) {
      case 1:
        navigate('/admin/user');
        break;
      case 2:
        navigate('/');
        break;
      case 3:
        navigate('/organizer/events');
        break;
      case 4:
        navigate('/staff/checkin');
        break;
      default:
        navigate('/');
        break;
    }
  };
  return (
    <>
      <Header />
      <Result
        className="bg bg-light"
        status="500"
        title="500"
        subTitle="Có lỗi xảy ra."
        extra={<CustomButton type="primary" onClick={handleBackClick}>Quay lại</CustomButton>}
      />
      <Footer />
    </>
  );
}