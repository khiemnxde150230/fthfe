import Header from "../../component/Header";
import HeaderAdmin from "../../component/Admin/Header";
import Navbar from "../../component/Organizer/Navbar";
import NavbarStaff from "../../component/Staff/NavbarStaff";
import { Form, Button, Modal } from 'react-bootstrap';
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import Footer from "../../component/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import { v4 } from "uuid";
import { UpdateUserService, GetInforByEmailService, ChangePassowrdService } from '../../services/UserService';
import { toast } from "react-toastify";
import { vi } from 'date-fns/locale';
import styled from "styled-components";

const CustomRadio = styled(Form.Check)`
  .form-check-input:checked {
    background-color: #EC6C21;
    border-color: #EC6C21;
  }

  .form-check-input:checked::before {
    background-color: #EC6C21;
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

function Profile() {

    const { user, setUser, onSetRender } = useContext(UserContext);

    const renderNavbar = () => {
        if (user) {
            switch (user.roleId) {
                case 1:
                    return <HeaderAdmin />;
                case 2:
                    return <Header />;
                case 3:
                    return <Navbar />;
                case 4:
                    return <NavbarStaff />;
                default:
                    return <Header />;
            }
        }
    };

    const [userInfo, setUserInfo] = useState({
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        birthDay: user.birthDay || '',
        gender: user.gender || '',
    });

    useEffect(() => {
        setUserInfo({
            fullName: user.fullName || '',
            phone: user.phone || '',
            avatar: user.avatar || '',
            birthDay: user.birthDay || '',
            gender: user.gender || '',
        });
    }, [user]);

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);


    const handleImageClick = () => {
        setShowAvatarModal(true);
    };

    const inputRef = useRef(null);

    const handleInputImage = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const imgRef = ref(storage, `images/avatar_images/${user.email}_${v4()}`);
            try {
                const snapshot = await uploadBytes(imgRef, file);
                const url = await getDownloadURL(snapshot.ref);
                setUserInfo(prevState => ({ ...prevState, avatar: url }));
                toast.success('Ảnh đã được tải lên thành công!');
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Lỗi khi tải lên ảnh!');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    // const handleDateChange = (date) => {
    //     const formattedDate = date.toLocaleDateString('en-CA').split('/').reverse().join('-');
    //     setUserInfo({ ...userInfo, birthDay: formattedDate });
    // };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.toLocaleDateString('en-CA').split('/').reverse().join('-');
            setUserInfo({ ...userInfo, birthDay: formattedDate });
        } else {
            setUserInfo({ ...userInfo, birthDay: null });
        }
    };
    

    const [newPassword, setNewPassword] = useState({
        inputNewPassword: '',
        inputComfirmPassword: '',
    });

    const handleInputPassword = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        setNewPassword((newPassword) => ({ ...newPassword, [field]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword.inputNewPassword === '' || newPassword.inputComfirmPassword === '') {
            toast.error('Mật khẩu không được để trống.');
            return;
        }
        if (newPassword.inputNewPassword === newPassword.inputComfirmPassword) {
            const result = await ChangePassowrdService(user.accountId, newPassword.inputNewPassword);
            if (result) {
                await GetInforByEmailService(user.email);
                setNewPassword('');
                onSetRender();
                setShowChangePasswordModal(false);
                toast.success('Cập nhật mật khẩu thành công!');
            }
        } else if (newPassword.inputNewPassword !== newPassword.inputComfirmPassword) {
            toast.error('Mật khẩu và mật khẩu xác nhận không trùng nhau!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            accountId: user.accountId,
            fullName: userInfo.fullName,
            phone: userInfo.phone,
            birthDay: userInfo.birthDay || null,
            gender: userInfo.gender,
            avatar: userInfo.avatar,
        };
        console.log(data);
        const result = await UpdateUserService(data);
        if (result.status === 200 && result.message === 'Update Successfully') {
            const response = await GetInforByEmailService(user.email);
            if (response) {
                setUserInfo({
                    fullName: response.result.user.fullName,
                    avatar: response.result.user.avatar,
                    phone: response.result.user.phone,
                    birthDay: response.result.user.birthDay,
                    gender: response.result.user.gender,
                });
                onSetRender();
                toast.success('Cập nhật thông tin thành công!');
            }
        }
        else if (result.status === 400 && result.message === 'Update Failly') {
            toast.error('Số điện thoại đã tồn tại');
        }
    };

    

    // const radioCheckStyle = {
    //     border: '#EC6C21',
    // };

    return (
        <>
            <div className="bg bg-dark">
                {renderNavbar()}
                <Form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm col-lg-4" style={{ maxWidth: '400px', margin: '10px auto', backgroundColor: '#101316' }}>
                    <div className="text-center mb-3">
                        <img
                            src={userInfo.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                            alt="Avatar"
                            className="rounded-circle"
                            width="150"
                            height="150"
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }}
                        />

                        <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} className="sm-10 md-8 lg-6">
                            <Modal.Header closeButton>
                                {user.roleId === 3 ? (
                                    <Modal.Title>Logo ban tổ chức</Modal.Title>
                                ) : (
                                    <Modal.Title>Ảnh đại diện</Modal.Title>
                                )}
                            </Modal.Header>
                            <Modal.Body className="d-flex flex-column align-items-center">
                                <img
                                    src={userInfo.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                                    alt="Full Avatar"
                                    className="img-fluid rounded-circle"
                                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                />
                                <div className="mt-3">
                                    <input type="file" ref={inputRef} onChange={handleInputImage} className="form-control"/>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                    <Form.Group className="mb-3" controlId="formFullName">
                        {
                            user.roleId === 3 ? (
                                <Form.Label style={{ fontWeight: 'bold' }}>Tên ban tổ chức</Form.Label>
                            ) : (
                                <Form.Label style={{ fontWeight: 'bold' }}>Họ và tên</Form.Label>
                            )
                        }
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={userInfo.fullName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPhoneNumber">
                        {
                            user.roleId === 3 ? (
                                <Form.Label style={{ fontWeight: 'bold' }}>Số điện thoại liên hệ</Form.Label>
                            ) : (
                                <Form.Label style={{ fontWeight: 'bold' }}>Số điện thoại</Form.Label>
                            )
                        }
                        <Form.Control
                            type="text"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label style={{ fontWeight: 'bold' }}>Email</Form.Label>
                        <Form.Control
                            style={{ cursor: 'not-allowed' }}
                            type="email"
                            name="email"
                            value={user.email}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label style={{ fontWeight: 'bold' }}>Mật khẩu</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type="password"
                                name="password"
                                value="************"
                                onChange={() => { }}
                                disabled
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowChangePasswordModal(true)}>
                                <i className="bi bi-pen"></i>
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBirthDate">
                        {
                            user.roleId === 3 ? (
                                <Form.Label style={{ fontWeight: 'bold' }}>Ngày thành lập</Form.Label>
                            ) : (
                                <Form.Label style={{ fontWeight: 'bold' }}>Ngày sinh</Form.Label>
                            )
                        }
                        <br />
                        <DatePicker
                            locale={vi}
                            selected={userInfo.birthDay}
                            onChange={handleDateChange}
                            showYearDropdown
                            scrollableYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                        />
                    </Form.Group>
                    {
                        user.roleId === 3 ? (
                            <></>
                        ) : (
                            <Form.Group className="mb-3" controlId="formGender">
                                <Form.Label style={{ fontWeight: 'bold' }}>Giới tính</Form.Label>
                                <div>
                                    <CustomRadio
                                        inline
                                        type="radio"
                                        label="Nam"
                                        name="gender"
                                        value="Nam"
                                        checked={userInfo.gender === 'Nam'}
                                        onChange={handleChange}
                                    />
                                    <CustomRadio
                                        inline
                                        type="radio"
                                        label="Nữ"
                                        name="gender"
                                        value="Nữ"
                                        checked={userInfo.gender === 'Nữ'}
                                        onChange={handleChange}
                                    />
                                    <CustomRadio
                                        inline
                                        type="radio"
                                        label="Khác"
                                        name="gender"
                                        value="Khác"
                                        checked={userInfo.gender === 'Khác'}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form.Group>
                        )
                    }
                    <CustomButton
                        type="submit"
                        className="mb-3 d-block mx-auto"
                        block
                    >
                        Hoàn thành
                    </CustomButton>
                </Form>
                <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
                    <Modal.Header closeButton onClick={() => setShowChangePasswordModal(false)}>
                        <Modal.Title>Đổi mật khẩu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate onSubmit={handleChangePassword}>
                            <Form.Group controlId="formChangePassword" className='w-100 mb-3'>
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nhập mật khẩu mới"
                                    name="inputNewPassword"
                                    value={newPassword.inputNewPassword}
                                    onChange={handleInputPassword}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formForgotPassword" className='w-100 mb-3'>
                                <Form.Label>Xác nhận mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Xác nhận mật khẩu mới"
                                    name="inputComfirmPassword"
                                    value={newPassword.inputComfirmPassword}
                                    onChange={handleInputPassword}
                                    required
                                />
                            </Form.Group>
                            <CustomButton type="submit" className="w-100 mb-3">
                                Đổi mật khẩu
                            </CustomButton>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Footer />
            </div>
        </>
    );
}

export default Profile;