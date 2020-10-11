import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class Landing extends Component {
    render() { 
      const loginButtons=(<div><a href="register" className="btn btn-lg btn-info mr-2">Sign Up</a>
      <a href="login" className="btn btn-lg btn-light">Login</a></div>);
        return (  
            <div>
            <div className="landing">
    <div className="dark-overlay landing-inner text-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="display-3 mb-4">Shin Watch
            </h1>
            <p className="lead"> Check out and request covers and arts , share your own with the world and gain products by being active</p>
            <hr />
            {this.props.auth.isAuthentificated? null : loginButtons}
            </div>
        </div>
      </div>
    </div>
  </div>    
            </div>
        );
    }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(Landing);