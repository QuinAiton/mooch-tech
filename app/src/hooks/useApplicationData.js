import { useEffect, useReducer } from 'react';

import axios from 'axios';
import { updateSpots } from '../helpers/selectors';

// Action types for the reducer
const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';
const REMOVE_INTERVIEW = 'REMOVE_INTERVIEW';

// Reducer function to manage application state
function reducer(state, action) {
  switch (action.type) {
    // Set the current day
    case SET_DAY:
      return { ...state, day: action.day };

    // Set application data (days, appointments, interviewers)
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };

    // Update the interview details for a given appointment
    case SET_INTERVIEW:
      return {
        ...state,
        appointments: action.appointments,
        days: action.days,
      };

    // Remove interview from the appointment
    case REMOVE_INTERVIEW:
      return {
        ...state,
        appointments: action.appointments,
        days: action.days,
      };

    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: [],
  });

  // Fetch initial data (days, appointments, interviewers) when component mounts
  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers'),
    ]).then((response) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: response[0].data,
        appointments: response[1].data,
        interviewers: response[2].data,
      });
    });
  }, []);

  // WebSocket setup for real-time updates
  useEffect(() => {
    const Socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`);

    Socket.onopen = () => {
      Socket.send('Socket Connection Made'); // Notify that the connection is established
    };

    Socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      // Handle the SET_INTERVIEW action
      if (response.type === 'SET_INTERVIEW') {
        const appointment = {
          ...state.appointments[response.id],
          interview: response.interview ? { ...response.interview } : null,
        };
        const appointments = {
          ...state.appointments,
          [response.id]: appointment,
        };
        const days = updateSpots(state.day, state.days, appointments); // Update spots based on the new state
        dispatch({ type: SET_INTERVIEW, appointments, days });
      }
    };
  }, [state]);

  // Set the current day
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  //  TODO: need to be able to create and update appointments

  // Cancel an interview by removing the interview from the appointment
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`api/appointments/${id}`, { data: { appointments } })
      .then(() => {
        const days = updateSpots(state.day, state.days, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  };

  // Return application state and helper functions for interacting with the data
  return { state, cancelInterview, setDay };
};