import React from 'react';
// import { history } from 'umi';
import conf from '@/utils/conf';

const Noperomise: React.FC<any> = () => {
  React.useEffect(() => {
    // sessionStorage.setItem('client_id', 'portal');
    window.location.href =
      conf.getBackendUrl() +
      `/authorize/?response_type=token&client_id=portal&redirect_uri=${window.location.origin}/portal/`;
  }, []);
  return (
    <>
      <div style={{ height: '100vh', background: '#fff' }}></div>
    </>
  );
};

export default Noperomise;
