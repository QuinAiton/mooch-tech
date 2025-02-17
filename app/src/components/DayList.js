import React from 'react';
import { DayListItem } from './DayListItem';

export const DayList = (props) => {
  const daysArray = props.days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={() => props.setDay(day.name)}
      />
    );
  });

  return <ul>{daysArray}</ul>;
};
