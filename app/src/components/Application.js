import React from 'react';
import 'components/Application.scss';
import { DayList } from './DayList';
import { Appointment } from './Appointments/Index';
import { getAppointmentsForDay } from '../helpers/selectors';
import { getInterview } from '../helpers/selectors';
import { getInterviewersForDay } from '../helpers/selectors';
import { useApplicationData } from '../hooks/useApplicationData';

export default function Application() {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

  const interviewersForDay = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        interviewers={interviewersForDay}
        interviewer={interview}
        {...appointment}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

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
        {schedule}, <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
