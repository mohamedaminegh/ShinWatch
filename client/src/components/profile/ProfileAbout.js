import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // Get first name
    const handle = profile.handle;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{handle}'s About</h3>
            <p className="lead">
              {isEmpty(profile.about) ? (
                <span>{handle} does not have an about</span>
              ) : (
                <span>{profile.about}</span>
              )}
            </p>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
