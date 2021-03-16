import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventList = props => {
  const events = props.items.map(event => {
    return (
      <EventItem
        key={event.Transaction.Id}//need to get some id back from server // TODO
        title={event.title}
        price={event.Transaction.TransactionAmount}
        date={event.ReturnDate}
        userId={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;
