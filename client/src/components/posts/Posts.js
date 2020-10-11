import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';
import SelectListGroup from '../common/SelectListGroup';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Filter By Date'
    };
    
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value  });
  }
  componentDidMount() {
    this.props.getPosts(this.state.type);
  }

  render() {
   //TODO make the filters work
    const { posts, loading } = this.props.post;
    let postContent;
    const options = [
      { label: 'Date', value: 'date' },
      { label: 'Upvotes', value: 'upvotes' }
    ];
    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {
      postContent = <div>
        <SelectListGroup
                  placeholder="Type"
                  name="type"
                  value={this.state.type}
                  onChange={this.onChange}
                  options={options}
                  info="Choose how you want to filter posts"
                />
        <PostFeed key="key" posts={posts} />
      </div>
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
