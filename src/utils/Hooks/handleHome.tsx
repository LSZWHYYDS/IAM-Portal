import { history } from 'umi';

export const handleHome = () => {
  if (location?.pathname === '/portal/' || location?.pathname === '/portal') {
    // storageClientID();
    if (sessionStorage.getItem('access_token')) {
      history.replace('/users/users' + window.location.search);
    } else {
      history.replace('/blankPage');
    }
    return true;
  }
  return false;
};
