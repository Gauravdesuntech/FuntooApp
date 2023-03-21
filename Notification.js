import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {navigationRef} from './navigationRef';


const useNotifications = (props) => {
  const notiResponseListener = React.createRef();

  useEffect(() => {
    notiResponseListener.current =
      Notifications.addNotificationResponseReceivedListener(res => {
        console.log(res.notification.request.content.data);
        console.log('addNotificationResponseReceivedListener');

        navigation.navigate(
          ('AdminNavigation', { screen: 'EventEnquiryDetail' }),
          {id: response.request.content.data.id }
        );
      });

    return () =>
      Notifications.removeNotificationSubscription(notiResponseListener);
  }, []);

};

export default useNotifications;