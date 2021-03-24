import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventList = props => {
  const events = props.items.map((event, index) => {
    return (
      <EventItem
        key={index}//need to get some id back from server // TODO
        title={event.Title}
        price={event.Transaction.TransactionAmount}
        date={event.ReturnDate}
        userId={props.authUserId}
        donor={event.Donor.UserName}
        username={props.authUsername}
        onDetail={props.onViewDetail}
        uniqueId={event.Transaction.Id}
      />
    );
  });

  return <ul className="event__list col-lg-6">{events}</ul>;
};

export default eventList;
