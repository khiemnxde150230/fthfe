import React, { useState, useContext } from 'react';
// import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Form, Input, Button, Row, Col, Modal, Typography } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { LoginService, LoginByGoogleService, RegisterService, ForgotPasswordService } from '../services/UserService';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import '../assets/css/CustomForm.css'
import ReCAPTCHA from "react-google-recaptcha";

const { Title, Text } = Typography;

const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

function Login() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgortPasswordModal] = useState(false);


  const { token, user, render, onSetRender, onSetUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState({
    inputEmail: '',
    inputPassword: '',
  });

  const [reCAPTCHAToken, setReCAPTCHAToken] = useState(null);

  const [registerInput, setRegisterInput] = useState({
    inputFullName: '',
    inputEmail: '',
    inputPhone: '',
    inputPassword: '',
  });

  const [registerForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();

  const [emailForgotPassword, setEmailForgotPassword] = useState('');

  const handleInputLogin = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setLoginInput((loginInput) => ({ ...loginInput, [field]: value }));
  };

  const handleReCAPTCHA = (token) => {
    setReCAPTCHAToken(token);
  };

  const handleInputRegister = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setRegisterInput((registerInput) => ({ ...registerInput, [field]: value }));
  };

  // const validateFullName = (name) => /^[a-zA-Z\s]+$/.test(name);
  // const validatePhoneNumber = (phone) => /^0\d{9}$/.test(phone);
  // const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    //event.preventDefault();
    const data = {
      email: loginInput.inputEmail,
      password: loginInput.inputPassword,
    };
    // if (!validateEmail(loginInput.inputEmail)) {
    //   toast.error('Email không hợp lệ!');
    //   return;
    // }
    // if (loginInput.inputPassword.trim() === '') {
    //   toast.error('Mật khẩu không được để trống.');
    //   return;
    // }

    const result = await LoginService(data);

    if (result.status !== undefined && result.status === 200) {
      onSetUser(result);
      localStorage.setItem('authToken', result.token);
      //localStorage.setItem('user', JSON.stringify(result.data));
      if (result.roleId === 1) {
        toast.success('Admin đăng nhập thành công');
        navigate('/admin/dashboard')
      } else if (result.roleId === 2) {
        toast.success(`Chào ${result.data.fullName}!`);
        navigate('/');
      } else if (result.roleId === 3) {
        navigate('/organizer/events')
        toast.success('Ban tổ chức đăng nhập thành công');
      } else if (result.roleId === 4) {
        navigate('/staff/checkin')
        toast.success('Staff đăng nhập thành công');
      }
    } else if (result.status === 400 && result.message === 'Please check your email to confirm your account') {
      toast.error('Vui lòng kiểm tra email của bạn để xác thực email!');
    } else if (result.status === 400 && result.message === 'The account is not found') {
      toast.error('Tài khoản không tồn tại!');
    } else if (result.status === 400 && result.message === 'Password is wrong') {
      toast.error('Mật khẩu sai!');
    } else if (result.status === 400 && result.message === 'Your account is blocked. Please contact admin!') {
      toast.error('Tài khoản đang bị khóa. Liên hệ fpttickethub@gmai.com để được hỗ trợ!');
    }
  };

  const onLoginWithGoogle = async (value) => {
    try {
      const decodedToken = jwtDecode(value);
      const data = {
        email: decodedToken.email,
        password: '',
        fullName: decodedToken.name,
        avatar: decodedToken.picture,
        status: 'Đang hoạt động',
      };
      const result = await LoginByGoogleService(data);
      if (result.status === 400 && result.message === 'Create A New Account Successfully') {
        onSetUser(result);
        localStorage.setItem('authToken', result.token);
        toast.success('Đăng nhập với Google thành công, chào mừng người dùng mới!');
        navigate('/');
      } else if (result.status === 200 && result.message === 'Login success!') {
        onSetUser(result);
        localStorage.setItem('authToken', result.token);
        if (result.roleId === 1) {
          navigate('/admin/dashboard');
          toast.success('Admin login thành công');
        } else if (result.roleId === 2) {
          toast.success(`Đăng nhập thành công, xin chào!`);
          navigate('/');
        } else if (result.roleId === 3) {
          navigate('/organizer/events')
          toast.success('BTC login thành công');
        } else if (result.roleId === 4) {
          navigate('/staff/checkin')
          toast.success('Staff login thành công');
        }
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
      onSetRender();
    } catch (error) {
      console.error('Token decoding error:', error);
      toast.error('Token decoding error');
    }
  };

  const handleRegister = async () => {
    //event.preventDefault();

    if (!reCAPTCHAToken) {
      toast.error('Hoàn thành reCaptcha để đăng ký!');
      return;
    }
    const data = {
      fullName: registerInput.inputFullName,
      phoneNumber: registerInput.inputPhone,
      email: registerInput.inputEmail,
      password: registerInput.inputPassword,
    };
    

    // if (!validateFullName(registerInput.inputFullName)) {
    //   toast.error('Tên đầy đủ không hợp lệ, chỉ chứa chữ cái và khoảng trắng.');
    //   return;
    // }

    // if (!validatePhoneNumber(registerInput.inputPhone)) {
    //   toast.error('Số điện thoại không hợp lệ, phải có 10 số và bắt đầu bằng số 0.');
    //   return;
    // }

    // if (!validateEmail(registerInput.inputEmail)) {
    //   toast.error('Email không hợp lệ!');
    //   return;
    // }

    // if (registerInput.inputPassword.trim() === '') {
    //   toast.error('Mật khẩu không được để trống.');
    //   return;
    // }

    const result = await RegisterService(data);

    if (result.status === 200) {
      toast.success(`Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản!`);
      setShowRegisterModal(false);
      setRegisterInput({
        inputFullName: '',
        inputEmail: '',
        inputPhone: '',
        inputPassword: '',
      });
      setLoginInput({
        inputEmail: '',
        inputPassword: '',
      });
      setReCAPTCHAToken(null);
      onSetRender();
      registerForm.resetFields();
    } else if (result.status === 400) {
      toast.error('Email hoặc số điện thoại đã tồn tại');
    }
  };

  const handleForgotPassword = async () => {
    //event.preventDefault();
    const result = await ForgotPasswordService(emailForgotPassword);
    if (result.result.status === 200) {
      toast.success(`Yêu cầu mật khẩu mới thành công, kiểm tra email của bạn!`);
      setEmailForgotPassword('');
      setShowForgortPasswordModal(false);
      setLoginInput({
        inputEmail: '',
        inputPassword: '',
      });
      forgotPasswordForm.resetFields();
      onSetRender();
    } else if (result.result.status === 400) {
      toast.error(`Tài khoản không tồn tại!`);
      setEmailForgotPassword('');
      setLoginInput({
        inputEmail: '',
        inputPassword: '',
      });
      onSetRender();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col lg={8} md={10} sm={10}>
          <div style={{ padding: '2rem', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#f8f9fa', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <Title level={1} style={{ marginBottom: '1rem', color: 'black' }}>Đăng nhập</Title>
            <Text style={{ fontSize: '1.2rem' }}>
              Chưa có tài khoản?
              <a
                onClick={() => setShowRegisterModal(true)}
                style={{ color: '#EC6C21', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', marginLeft: '7px' }}
              >
                Đăng ký
              </a>
            </Text>
            <Form layout="vertical" onFinish={handleLogin} style={{ marginTop: '2rem' }}>
              <Form.Item label="Email" name="inputEmail" rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  name="inputEmail"
                  value={loginInput.inputEmail}
                  onChange={handleInputLogin}
                  style={{ padding: '10px', border: '1px solid #ced4da', fontSize: '1.1rem' }}
                />
              </Form.Item>
              <Form.Item label="Mật khẩu" name="inputPassword" rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                {
                  pattern: /^\S+$/,
                  message: 'Mật khẩu không được chứa khoảng trắng'
                }
              ]}>
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  name="inputPassword"
                  value={loginInput.inputPassword}
                  onChange={handleInputLogin}
                  style={{ padding: '10px', border: '1px solid #ced4da', fontSize: '1.1rem' }}
                />
              </Form.Item>
              <CustomButton type="primary" htmlType="submit" block className='p-3' style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                Đăng nhập <i className="bi bi-box-arrow-in-left"></i>
              </CustomButton>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <a
                  onClick={() => setShowForgortPasswordModal(true)}
                  style={{ color: '#EC6C21', cursor: 'pointer', textDecoration: 'underline', fontSize: '1.1rem' }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Text style={{ fontSize: '1.1rem', color: 'black' }}>Hoặc</Text>
              </div>
              <div style={{ textAlign: 'center' }} className='d-flex justify-content-center align-items-center p-0'>
                <GoogleOAuthProvider clientId="732153710958-ec1rknfdfm3j7lsoqthnh9kfnr761fvd.apps.googleusercontent.com">
                  <GoogleLogin
                    locale="vi"
                    onSuccess={(token) => {
                      onLoginWithGoogle(token.credential);
                    }}
                    onError={() => {
                      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      <Modal open={showRegisterModal} onCancel={() => setShowRegisterModal(false)} footer={null} title="Đăng ký tài khoản">
        <Form name="registerForm" form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Tên đầy đủ" name="inputFullName" rules={[
            { required: true, message: 'Vui lòng nhập tên đầy đủ' },
            {
              pattern: /^[^\s][a-zA-ZÀ-ỹà-ỹ\s]*[^\s]$/,
              message: 'Tên đầy đủ không chứa ký tự đặc biệt'
            }
          ]}>
            <Input
              placeholder="Nhập tên đầy đủ"
              name="inputFullName"
              value={registerInput.inputFullName}
              onChange={handleInputRegister}
            />
          </Form.Item>
          <Form.Item label="Email" name="inputEmail" rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}>
            <Input
              type="email"
              placeholder="Nhập email"
              name="inputEmail"
              value={registerInput.inputEmail}
              onChange={handleInputRegister}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="inputPhone" rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            {
              pattern: /^\d{1,10}$/,
              message: 'Số điện thoại không hợp lệ'
            }
          ]}>
            <Input
              type="tel"
              placeholder="Nhập số điện thoại"
              name="inputPhone"
              value={registerInput.inputPhone}
              onChange={handleInputRegister}
            />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="inputPassword" rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            {
              pattern: /^\S+$/,
              message: 'Mật khẩu không được chứa khoảng trắng'
            }
          ]}>
            <Input.Password
              placeholder="Nhập mật khẩu"
              name="inputPassword"
              value={registerInput.inputPassword}
              onChange={handleInputRegister}
            />
          </Form.Item>
          <Form.Item>
            <ReCAPTCHA
              sitekey="6Ldt8wcqAAAAAEc9IzqtIdFRCmyB_LI0hWltliaZ"
              onChange={handleReCAPTCHA}
              hl='vi'
            />
          </Form.Item>
          <CustomButton type="primary" htmlType="submit" block>
            Đăng ký
          </CustomButton>
        </Form>
      </Modal>
      <Modal open={showForgotPasswordModal} onCancel={() => setShowForgortPasswordModal(false)} footer={null} title="Quên mật khẩu">
        <Form name="forgotPasswordForm" form={forgotPasswordForm} layout="vertical" onFinish={handleForgotPassword}>
          <Form.Item label="Email" name="emailForgotPassword" rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}>
            <Input
              type="email"
              placeholder="Nhập email"
              name="emailForgotPassword"
              value={emailForgotPassword}
              onChange={(e) => setEmailForgotPassword(e.target.value)}
            />
          </Form.Item>
          <CustomButton type="primary" htmlType="submit" block>
            Nhận mật khẩu mới <i className="bi bi-envelope-at"></i>
          </CustomButton>
        </Form>
      </Modal>
    </div>
  );
}

export default Login;