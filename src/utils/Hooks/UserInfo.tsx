import { currentUser as queryCurrentUser } from '../../services/digitalsee/api';
import { getPermMenuData } from '@/utils/configs.utils';
// import { setLicData } from '@/utils/common.utils';
import request from 'umi-request';
export async function getPolicies() {
  return request('/iam/api/configs/policies', {
    headers: {
      Authorization: ``,
    },
  });
}
export async function tenantLicense() {
  return request('/iam/api/tenantLicense');
}
export const fetchUserInfo = async () => {
  try {
    const msg = await queryCurrentUser();
    return msg.data;
  } catch (error) {}
  return undefined;
};

export const getPolicieData = async () => {
  try {
    const result = await getPolicies();
    return result.data;
  } catch (error) {}
  return undefined;
};

// 判断有token并且是管理平台的首页则执行这段代码
export const handleHaveToken = async () => {
  const currentUser: any = await fetchUserInfo();
  if (currentUser.tenant_id) {
    sessionStorage.setItem('tcode', currentUser.tenant_id);
  }
  const policyData = await getPolicieData();
  sessionStorage.setItem('ucName', policyData?.uc_name);
  sessionStorage.setItem('permMenus', JSON.stringify(currentUser));
  const menuData = getPermMenuData(
    (currentUser && currentUser.permissions_sets) || [],
    currentUser.username || '',
  );

  return {
    fetchUserInfo,
    currentUser,
    menuData,
    policyData,
    settings: {},
  };
};
