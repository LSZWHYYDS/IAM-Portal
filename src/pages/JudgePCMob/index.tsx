import { useEffect } from 'react';
import { history } from 'umi';
import React from 'react';
const Index: React.FC<any> = () => {
  useEffect(() => {
    // sessionStorage.setItem('client_id', 'portal');
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      history.push({
        pathname: '/person/userapplyforControl',
      });
    } else {
      history.push({
        pathname: '/person/selfInfo',
      });
    }
  }, []);
  return <></>;
};
export default Index;
