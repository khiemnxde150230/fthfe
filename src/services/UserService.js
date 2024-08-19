import request from '../utils/request';

export const LoginService = async (data) => {
  try {
    const respone = await request({
      method: 'post',
      url: `home/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const GetInforService = async (token) => {
  try {
    const response = await request({
      method: 'get',
      url: `user/info?token=${token}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const LoginByGoogleService = async (data) => {
  try {
    const response = await request({
      method: 'post',
      url: `home/loginByGoogle`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const RegisterService = async (data) => {
  try {
    const respone = await request({
      method: 'post',
      url: 'home/register',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const ConfirmAccountService = async (email) => {
  try {
    const respone = await request({
      method: 'get',
      url: `home/confirm?email=${email}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const ForgotPasswordService = async (email) => {
  try {
    const respone = await request({
      method: 'post',
      url: `home/forgotPassword?email=${email}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(respone);
    return respone;
  } catch (e) {
    return e;
  }
};

export const UpdateUserService = async (data) => {
  try {
    const response = await request({
      method: 'post',
      url: 'user/updateUser',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const GetInforByEmailService = async (email) => {
  try {
    const response = await request({
      method: 'get',
      url: `home/search?email=${email}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const ChangePassowrdService = async (accountId, newPassword) => {
  try {
    const response = await request({
      method: 'post',
      url: `user/changePassword?accountId=${accountId}&newPassword=${newPassword}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const GetAllUserAccountsService = async () => {
  try {
    const response = await request({
      method: 'get',
      url: 'user/getAllAccountUser',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const ChangeStatusUserService = async (accountId, newStatus) => {
  try {
    const response = await request({
      method: 'post',
      url: `user/ChangeStatusUser?accountId=${accountId}&newStatus=${newStatus}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw new Error(`Error changing user status: ${error.message}`);
  }
};
export const ChangeRoleService = async (accountId, newRoleId) => {
  try {
    const response = await request({
      method: 'post',
      url: `user/changeRole?accountId=${accountId}&newRoleId=${newRoleId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};
