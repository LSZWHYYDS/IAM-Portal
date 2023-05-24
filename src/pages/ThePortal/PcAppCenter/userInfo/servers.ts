import request from 'umi-request';
// // 添加用户的接口
// export async function addMeApplicationList(client_id) {
//   return request(`/iam/api/self/myApps/${client_id}`, {
//     method: 'POST',
//   });
// }/**
//  * 启用禁用用户
//  */
export async function modifyPassword(body: any) {
  return request('/iam/api/self/password', {
    method: 'PUT',
    data: { ...body },
  });
}

export async function modifyRenew(body: any) {
  return request('/iam/api/self/account/renewal/apply', {
    method: 'POST',
    data: { ...body },
  });
}

/**
    *  "apply_explain": "eiusmod aute",
       "detail_url": "",
       "end_date": "1999-08-25",
       "apply_type": "申请延期",
       "user_count": "26"
    * 
   */
