import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { take } from 'lodash';

import { fetchCreatedEvents, fetchJoinedEvents, fetchEvents, auth, selectEvent} from '../../actions/';

import Spinner from '../../helpers/spinner.js';


import FeaturedEventsList from './FeaturedEventsList';
import JoinedEventsList from './JoinedEventsList';
import CreatedEventsList from './CreatedEventsList';

import GoogleMapsSearchBar from '../searchbar/GoogleMapsSearchBar';

class Dashboard extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {

    this.props.auth().then(() => {
      if(!this.props.isLoggedIn) {
        this.context.router.push('/');
      }
      this.props.fetchEvents();
      this.props.fetchCreatedEvents(this.props.user.id);
      this.props.fetchJoinedEvents(this.props.user.id);
    });

  }


  render() {
    const events = this.props.events;
    const joinedEvents = this.props.joinedEvents;
    const createdEvents = this.props.createdEvents;
    if (events.length === 0) {
      return (
        <Spinner />
      );
    }
    return (
      <div className='dashboard'>
        <div className='row'>
          <GoogleMapsSearchBar />
        </div>
        <div className='row'>
          <div className="col s7">FEATURED
            <FeaturedEventsList select={this.props.selectEvent} data={ take(events, 9) } />
          </div>
          <div className="col s5">
            <div className="">JOINED
              <JoinedEventsList select={this.props.selectEvent} data={ take(joinedEvents, 4) } />
            </div>
            <div className="">CREATED
              <CreatedEventsList select={this.props.selectEvent} data={ take(createdEvents, 4) } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchCreatedEvents, fetchJoinedEvents, fetchEvents, auth, selectEvent}, dispatch);
}

function mapStateToProps(state) {
  return {
    events: state.events.all,
    isLoggedIn: state.user.isLoggedIn,
    event: state.events.event,
    createdEvents: state.events.createdEvents,
    joinedEvents: state.events.joinedEvents,
    user: state.user
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
