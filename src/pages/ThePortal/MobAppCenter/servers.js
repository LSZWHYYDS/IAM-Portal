import request from 'umi-request';

// 拿到ID 查询简介信息
export async function getAppInfos(params) {
  return request(`/iam/api/apps/${params.client_id}`, {
    method: 'GET',
  });
}

// 点击申请发送接口
export async function setDefaultApp(body) {
  return request('/iam/api/self/apps/apply', {
    method: 'POST',
    data: body,
  });
}

// 分页接口
export async function getAppLists(params) {
  //   /iam/api/apps/v2
  const result = await request('/iam/api/self/apps', {
    method: 'GET',
    params: {
      ...params,
    },
  });
  const response = {
    data: result.data.items,
    current: result.data.page,
    pageSize: result.data.size,
  };
  return response;
}

// 获取用户名称
export async function getUserInfo_ls(params) {
  return request(`/iam/api/self/user_info`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
}

// ls_请求应用分类
export async function requestData() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

// ls_请求应用分类(移动端)
export async function requestDatas() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

// 切换tab 发送接口
export async function getAppLists_ls(params = {}) {
  const result = await request('/iam/api/self/apps', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  return result;
}

// 获取用户信息
export async function getUserInfo_lss() {
  return request('/iam/api/self/user_info', {
    method: 'GET',
  });
}

// 获取用户所有的应用列表
export async function getMeApplicationList_mob() {
  return request('/iam/api/self/myApps', {
    method: 'GET',
  });
}
// 删除用户的应用接口
export async function deleteMeApplicationList_mob(client_id) {
  return request(`/iam/api/self/myApps/${client_id}`, {
    method: 'DELETE',
  });
}
// 添加用户的接口
export async function addMeApplicationList_mob(client_id) {
  return request(`/iam/api/self/myApps/${client_id}`, {
    method: 'POST',
  });
}
