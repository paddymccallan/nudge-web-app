import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    pendingNudges: [],
    activeNudges: [],
    isLoading: false,
    selectedEvent: null,
    hostUrl: window.location.href.indexOf('localhost') >-1 ? 'https://localhost:44347' : 'https://nudgeapi.herokuapp.com'
  };
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.messageRef = React.createRef();
    this.categoryRef = React.createRef();
    this.almsmanRef = React.createRef();
    this.amountRef = React.createRef();
    this.returnDateElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchActiveNudges();
    this.fetchPendingNudges();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const message = this.messageRef.current.value;
    const category = this.categoryRef.current.value;
    const almsman = this.almsmanRef.current.value;
    const amount = this.amountRef.current.value;
    const returnDate = this.returnDateElRef.current.value;

    if (
      title.trim().length === 0 ||
      amount <= 0 ||
      returnDate.trim().length === 0 ||
      message.trim().length === 0
    ) {
      return;
    }

    const event = { title, message, category, almsman, amount, returnDate };
    console.log(event);

    const requestBody = {
      "Title": title,
      "Message": message,
      "Category": category,
      "Almsman": {
        "UserName": this.context.username
      },
      "Donor": {
        "UserName": almsman//change this ref to donor!!
      },
      "Transaction": {
        "TransactionRequestTime": new Date().toISOString(),
        "TransactionAmount": amount
      },
      "ReturnDate": returnDate
    };

    const token = this.context.token;

    fetch('api/Nudge/StartNudgeRequest', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedNudges = [...prevState.pendingNudges];
          updatedNudges.push({
            _id: "",
            title: title,
            message: message,
            returnDate: returnDate,
            amount: amount,
            almsman: almsman
          });
          return { pendingNudges: updatedNudges };
        });
      })
      .catch(err => {
        //at the minute were getting a 404 because we arent creating the nudge id before returning it. For now add nudge to stack anyway
        this.setState(prevState => {
          const updatedNudges = [...prevState.pendingNudges];
          updatedNudges.push({
            _id: "",
            title: title,
            message: message,
            returnDate: returnDate,
            amount: amount,
            almsman: almsman
          });
          return { pendingNudges: updatedNudges };
        });
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchActiveNudges() {
    this.setState({ isLoading: true });
    console.log(this.context);
    const token = this.context.token;
    fetch(this.state.hostUrl + '/api/Nudge/GetMyActiveNudges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const activeNudges = resData;
        if (this.isActive) {
          this.setState({ activeNudges: activeNudges, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  fetchPendingNudges() {
    this.setState({ isLoading: true });
    console.log(this.context);
    const token = this.context.token;
    fetch(this.state.hostUrl +'/api/Nudge/GetMyPendingNudges', {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Authorization': 'Bearer ' + token},           
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const pendingNudges = resData;
        if (this.isActive) {
          this.setState({ pendingNudges: pendingNudges, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.pendingNudges.find(e => e.Transaction.Id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    console.log(this.state.selectedEvent)
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
        variables: {
          id: this.state.selectedEvent._id
        }
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Nudge"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="title">Message</label>
                <input type="text" id="title" ref={this.messageRef} />
              </div>
              <div className="form-control">
                <label htmlFor="title">Category</label>
                <input type="text" id="title" ref={this.categoryRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Amount</label>
                <input type="number" id="price" ref={this.amountRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Return Date</label>
                <input type="datetime-local" id="date" ref={this.returnDateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="title">Almsman</label>
                <input type="text" id="title" ref={this.almsmanRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <div className="d-flex justify-content-center">
          <Modal
            title="Your Nudge Request"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={'Cancel nudge request'}
          >
            <h1>{this.state.selectedEvent.Title}</h1>
            <h3>
              You have requested a nudge to {this.state.selectedEvent.Donor.UserName} of the amount of £{this.state.selectedEvent.Transaction.TransactionAmount} and have confirmed it to be returned on or before{' '}
              {new Date(this.state.selectedEvent.Transaction.TransactionRequestTime).toLocaleDateString()}
            </h3>
            <p>{this.state.selectedEvent.Message}</p>
            <p className="text-muted">{this.state.selectedEvent.Donor.UserName} still has not confirmed this request, so you can still cancel it.</p>
          </Modal>
          </div>
        )}
        <div className="container">
        {this.context.token && (
          <div className="events-control col col-lg-2">
            <p>Create a new nudge!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create request
            </button>
          </div>
        )}
        {/* pending nudges list */}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            items={this.state.pendingNudges}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
        {/* Active nudges list */}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            items={this.state.activeNudges}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
