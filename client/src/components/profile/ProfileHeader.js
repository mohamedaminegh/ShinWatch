import React, { Component } from 'react';
import isEmpty from '../../utils/is-empty';

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;
    const avatarLink = "http://localhost:3000/"+profile.user.avatar;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-6 m-auto">
                <img
                width ='50px'
                height = '400px'
                  className="rounded-circle"
                  src={avatarLink}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.handle}</h1>
              <p className="lead text-center">
                {profile.status}{' '}
              </p>
              {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
              <p>
                {isEmpty(profile.website) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-globe fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.twitter) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.twitter}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.facebook) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.facebook}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-facebook fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.youtube) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.youtube}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-youtube fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.instagram) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.instagram}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
