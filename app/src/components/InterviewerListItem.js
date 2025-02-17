import React from 'react';
import './InterviewerListItem.scss';
import classnames from 'classnames';

export const InterviewerListItem = (props) => {
  const SelectedListItem = classnames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });
  return (
    <li className={SelectedListItem} onClick={props.setInterviewer}>
      <img
        className='interviewers__item-image'
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};
