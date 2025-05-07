import { Builder } from '@features/builder/Builder';
import { Login } from '@features/login/Login';
import { ProvidePdf } from '@features/provide-pdf/ProvidePdf';
import { AppContext } from 'contexts/AppContext';
import { useContext } from 'react';

export const App = () => {
  const { currentRoute } = useContext(AppContext);

  const getPage = () => {
    let page = <></>;

    switch (currentRoute) {
      case 'login':
        page = <Login />;
        break;

      case 'providePdf':
        page = <ProvidePdf />;
        break;

      case 'builder':
        page = <Builder/>;
        break;
    }

    return page;
  };

  return (
    getPage()
  );
};
