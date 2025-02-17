import 'components/Appointments/styles.scss';

import React, { useEffect } from 'react';

import { Confirm } from 'components/Appointments/Confirm';
import { Empty } from 'components/Appointments/Empty';
import { Error } from 'components/Appointments/Error';
import { Form } from 'components/Appointments/Form';
import { Header } from 'components/Appointments/Header';
import { Show } from 'components/Appointments/Show';
import { Status } from 'components/Appointments/Status';
import { useVisualMode } from '../../hooks/useVisualMode';

export const Appointment = (props) => {
  const EMPTY = 'EMPTY',
    SHOW = 'SHOW',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    SAVING = 'SAVING',
    DELETE = 'DELETE',
    CONFIRM = 'CONFIRM',
    ERROR_SAVE = 'ERROR_SAVE',
    ERROR_DELETE = 'ERROR_DELETE',
    ERROR_EMPTY = 'ERROR_EMPTY';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  const onDelete = async () => {
    transition(DELETE, true);
    try {
      await props.cancelInterview(props.id);
      transition(EMPTY);
    } catch (error) {
      transition(ERROR_DELETE, true);
    }
  };

  // TODO: Need to be able to create and update Interviews

  return (
    <article className='appointment' data-testid='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message='Saving Interview' />}
      {mode === DELETE && <Status message='Deleting Interview' />}
      {mode === ERROR_SAVE && (
        <Error
          message='Sorry We Were Not Able To Create the Appointment'
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message='Sorry We Were Not Able To Delete the Appointment'
          onClose={() => back()}
        />
      )}
      {mode === ERROR_EMPTY && (
        <Error
          message='Please Fill Out All The Fields'
          onClose={() => back()}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message='Are you Sure You Want to Delete This Interview?'
          onConfirm={onDelete}
          onCancel={() => back()}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onCancel={() => back()}
        />
      )}
    </article>
  );
};
