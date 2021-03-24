import React from 'react';

import './Modal.css';

const modal = props => (
  <div className="modal1">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal-body">{props.children}</section>
    <section className="modal-footer">
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canConfirm && (
        <button className="btn" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
);

export default modal;
