export type MapIs = {
  logo_uri: string;
  authed: boolean;
  client_name: string;
  client_id: string | number;
  isDisabled: boolean;
};

export type VerifyUserInfo = {
  create_by: string;
  login_url?: string;
};

export type VerifyObj = {
  create_by: string;
  login_url?: string;
  link_client_id?: string;
};

// URL参数路径
export type UrlPar = {
  a: string;
};
