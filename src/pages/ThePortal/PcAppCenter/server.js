import request from 'umi-request';
// 分页接口
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
export async function getUserInfo_ls() {
  return request('/iam/api/self/user_info', {
    method: 'GET',
  });
}
// 获取用户所有的应用列表
export async function getMeApplicationList() {
  return request('/iam/api/self/myApps', {
    method: 'GET',
  });
}
// 删除用户的应用接口
export async function deleteMeApplicationList(client_id) {
  return request(`/iam/api/self/myApps/${client_id}`, {
    method: 'DELETE',
  });
}
// 添加用户的接口
export async function addMeApplicationList(client_id) {
  return request(`/iam/api/self/myApps/${client_id}`, {
    method: 'POST',
  });
}
