export type VerifyProps = {
  controlShow: boolean;
  controlClose: () => void;
  refreshMeAppList: () => void;
  myApplicationList: any[];
  delteIndex: number | string;
  MeIds: any;
};

export type AppInfoVerify = {
  client_uri: string;
  client_id: string;
  gw_status: string;
  client_name: string;
  authed: boolean;
  logo_uri: string;
  link_client_id: string;
};

export type VerifyUserInfo = {
  description: string;
  client_name: string;
  logo_uri: string;
};

export type VerifyuserInfos = {
  orgs: [];
  username: string;
  phone_number: string | number;
  email: string;
  gender: string;
  nickname: string;
  create_time: string;
  name: string;
  logo_uri: string;
  client_name: string;
};
