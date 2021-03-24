import React from 'react';

import './EventItem.css';

const eventItem = props => (
  <li key={props.uniqueId} className={ props.donor == props.username ?  "events__list-item outgoing" : "events__list-item incoming"}>
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>Your the owner of this event.</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.uniqueId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
