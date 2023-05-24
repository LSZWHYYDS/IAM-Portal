import React from 'react';
// import { PageLoading } from '@ant-design/pro-layout';
import Headers from '@/components/Headers';
import Appcenter from '../PcAppCenter';

const UserInfo: React.FC<any> = () => {
  return (
    <div style={{ height: '100vh', backgroundColor: '#e8e8e8' }}>
      <Headers></Headers>
      <div style={{ background: '#f40' }}></div>
      <Appcenter></Appcenter>
    </div>
  );
};
export default UserInfo;
