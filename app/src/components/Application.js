import 'components/Application.scss';

import { Appointment } from './Appointments/Index';
import { DayList } from './DayList';
import React from 'react';
import { getAppointmentsForDay } from '../helpers/selectors';
import { getInterview } from '../helpers/selectors';
import { getInterviewersForDay } from '../helpers/selectors';
import { useApplicationData } from '../hooks/useApplicationData';

export default function Application() {
  const {
    state,
    setDay,
    cancelInterview,
  } = useApplicationData();

  const interviewersForDay = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);


  // TODO: need to display all the interview data from the database. 
  // Some helper functions that may help with this are Appointment component and getInterview function



  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className='sidebar__lhl sidebar--centered'
          src='images/lhl.png'
          alt='Lighthouse Labs'
        />
      </section>
      <section className='schedule'>
      </section>
    </main>
  );
}
