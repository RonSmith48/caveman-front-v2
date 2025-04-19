// utils/notifierHelpers.js
import { useNotifier } from 'contexts/NotifierContext';

export const notifyActivity = (notify, activityId, event = 'updated', payload = null) => {
  const key = `activity/${String(activityId)}/${event}`;
  notify(key, payload);
};

/* 
Example Useage:
import { useNotifier } from 'contexts/NotifierContext';
import { notifyActivity } from 'utils/notifierHelpers';

const { notify } = useNotifier();
notifyActivity(notify, 314, 'updated', { user: 'ron' });
*/

import { useEffect } from 'react';

export const useActivityListener = (activityId, event = 'updated', callback) => {
  const { subscribe } = useNotifier();
  const key = `activity/${String(activityId)}/${event}`;

  useEffect(() => {
    const unsubscribe = subscribe(key, callback);
    return unsubscribe;
  }, [key]);
};

/* 
Example Useage:
useActivityListener(314, 'updated', (payload) => { console.log('Activity updated:', payload);});
*/
