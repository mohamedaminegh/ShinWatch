import React, { Component } from 'react';
//import axios from 'axios';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      avatar: null,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount(){
    if(this.props.auth.isAuthentificated){
      this.props.history.push('/profile');
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors:nextProps.errors});
    }
  }
  onChange(e) {
    //if i'm changing the value of the file
    if(e.target.files)
    {const file = e.target.files[0];
    this.setState({ [e.target.name]: e.target.value , avatar: file});
      }
    //changing any other target
    else
    {
    this.setState({ [e.target.name]: e.target.value  });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.avatar);
    const fd = new FormData();
    fd.append('name',this.state.name);
    fd.append('email',this.state.email);
    fd.append('password',this.state.password);
    fd.append('password2',this.state.password2);
    fd.append('avatar', this.state.avatar);
    /*const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      avatar : fd
    };*/

    /*axios
      .post('/api/users/register', fd)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }));*/
    this.props.registerUser(fd, this.props.history);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your ShinWatch account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
              <div className="form-group">
              <input type="file" 
                    className="form-control form-control-lg"  
                    name="avatar" onChange={this.onChange}/>
              </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>    
      </div>
    );
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps= (state)=> ({
  auth : state.auth,
  errors: state.errors
});
export default connect(mapStateToProps,{registerUser})(withRouter(Register));
