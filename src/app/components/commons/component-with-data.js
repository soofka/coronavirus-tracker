import * as utils from '../../utils';

export const states = {
	IDLE: 'IDLE',
	FETCHING: 'FETCHING',
	DATA: 'DATA',
	ERROR: 'ERROR',
	FETCHING_DATA: 'FETCHING_DATA',
	FETCHING_ERROR: 'FETCHING_ERROR',
};

export const addDataToComponent = (events, render) => {
  const machine = getMachine(events);
  utils.subscribe(Object.values(events), (event) =>
    render(
      machine.getNextState(event.type),
      event.payload,
    ),
  );
};

const getMachine = (events) => {
  let state = states.IDLE;

  const machine = {
    [states.IDLE]: {
      [events.FETCH]: states.FETCHING,
    },
    [states.DATA]: {
      [events.FETCH]: states.FETCHING,
    },
    [states.ERROR]: {
      [events.FETCH]: states.FETCHING,
    },
    [states.FETCHING]: {
      [events.FETCH_FROM_CACHE_SUCCESS]: states.FETCHING_DATA,
      [events.FETCH_FROM_CACHE_FAILURE]: states.FETCHING_ERROR,
      [events.FETCH_FROM_INTERNET_SUCCESS]: states.FETCHING_DATA,
      [events.FETCH_FROM_INTERNET_FAILURE]: states.FETCHING_ERROR,
    },
    [states.FETCHING_DATA]: {
      [events.FETCH_FROM_CACHE_SUCCESS]: states.DATA,
      [events.FETCH_FROM_CACHE_FAILURE]: states.DATA,
      [events.FETCH_FROM_INTERNET_SUCCESS]: states.DATA,
      [events.FETCH_FROM_INTERNET_FAILURE]: states.DATA,
    },
    [states.FETCHING_ERROR]: {
      [events.FETCH_FROM_CACHE_SUCCESS]: states.DATA,
      [events.FETCH_FROM_CACHE_FAILURE]: states.ERROR,
      [events.FETCH_FROM_INTERNET_SUCCESS]: states.DATA,
      [events.FETCH_FROM_INTERNET_FAILURE]: states.ERROR,
    },
  };

  const getNextState = (event) => {
    const nextState = machine[state][event];
  
    if (nextState) {
      state = nextState;
    }
    
    return state;
  };

  return {
    getNextState,
  };
};
