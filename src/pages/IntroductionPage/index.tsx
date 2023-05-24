import Banner from './components/banner';
import Certification from './components/certification';
import CloudIdentity from './components/cloudIdentity';
import Introduction from './components/introduction';
import Security from './components/security';

const index = () => {
  return (
    <>
      <Banner />
      <Introduction />
      <CloudIdentity />
      <Certification />
      <Security />
    </>
  );
};

export default index;
