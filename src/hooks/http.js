import { useReducer, useCallback } from 'react';

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'REQ':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      }; // he changed it so it returns ) add data: null to make sure u reset the data to null
    case 'RES':
      return {
        ...httpState,
        loading: false,
        data: action.resData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not get here');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null, //added for custom hook
    extra: null, //added for custom hook
    identifier: null
  });

  const sendReq = useCallback(async (url, method, body, extra, identifier) => {
    //bring in stuff from component
    try {
      dispatchHttp({ type: 'REQ', identifier }); // extra like id for remove handler (he changed it so it returns now
      const res = await fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await res.json(); //extracts response body for fetch
      dispatchHttp({ type: 'RES', resData, extra }); // how to get this in ingredients.js? in the reducer for RES add data: action.resData (for example)

      //   dispatch({ type: 'DELETE', id });
      // the hook should only focus on http request, not on what u do with the rseults
      // what you do with the hook doesnt belong in here, id is gotten from the remove ingredient handler in ingredits
    } catch (err) {
      dispatchHttp({ type: 'ERROR', error: true });
    }
  }, []);

  return {
    //u can return what u want here, not just object
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendReq: sendReq,
    extra: httpState.extra,
    identifier: httpState.identifier //return stuff in extra like id for useEffect to update ingredients State in ingredients.js
  };
};
export default useHttp;
