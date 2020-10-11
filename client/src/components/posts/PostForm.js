import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import {addPost} from '../../actions/postActions'
class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: '',
      description: '',
      content: null,
      type: '',
      title: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    
      fd.append('handle',this.state.handle);
      fd.append('description',this.state.description);
      fd.append('content',this.state.content);
      fd.append('type',this.state.type);
      fd.append('title',this.state.title);
    this.props.addPost(fd, this.props.history);
  }

  onChange(e) {
    //if i'm changing the value of the file
    if(e.target.files)
    {const file = e.target.files[0];
    this.setState({ [e.target.name]: e.target.value , content: file});
      }
    //changing any other target
    else
    {
    this.setState({ [e.target.name]: e.target.value  });
    }
  }

  render() {
    const { errors } = this.state;
    const imageContent =(
        <div className="form-group">
              <input type="file" 
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.content
                      })}  
                    error={errors.content} 
                    name="content" onChange={this.onChange}/>
                {errors.content && <div className="invalid-feedback">{errors.content}</div>}
              </div>
    );
    const videoContent =(
        <InputGroup
            placeholder="a Youtube Page URL"
            name="content"
            icon="fa fa-youtube"
            value={this.state.content}
            onChange={this.onChange}
            error={errors.content}
          />
    );

    

    // Select options for type
    const options = [
      { label: 'Image', value: 'Image' },
      { label: 'Video', value: 'Video' }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Add a Post</h1>
              <p className="lead text-center">
                Share your art with the world!
              </p>
              <small  className="font-italic" >* are required fields </small>
              <form onSubmit={this.onSubmit}>

                <SelectListGroup
                  placeholder="Type"
                  name="type"
                  value={this.state.type}
                  onChange={this.onChange}
                  options={options}
                  error={errors.type}
                  info="Type of the file to upload"
                />
                
                {this.state.type==="Video"? videoContent : imageContent}
                
                <TextFieldGroup
                  placeholder="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                  info="Title of the post"
                />
                <TextAreaFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Description of the post "
                />

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost })(
  withRouter(PostForm)
);
