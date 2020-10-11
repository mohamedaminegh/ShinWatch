import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Moment from 'react-moment';
import { addLike, addReaction} from '../../actions/postActions';

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onLikeClick(id) {
    this.props.addLike(id);
  }
  
  onReactClick(id,type) {
    this.props.addReaction(id,type);
  }


  findUserLike(upvotes) {
    const { auth } = this.props;
    if (upvotes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  findUserReact(reactions) {
    const { auth } = this.props;
    if (reactions.filter(react => react.user === auth.user.id ).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    //TODO Add when the post was added by substracting current date - post.date and maybe add the number of comments
    const { post,  showActions , errors} = this.props;
    const linkProfile="profile/"+post.handle;
    //Like button if logged in
    const likeButton=(<button
      onClick={this.onLikeClick.bind(this, post._id)}
      type="button"
      className="btn btn-light mr-1"
    >
      <i
        className={classnames('fa fa-thumbs-up', {
          'text-info': this.findUserLike(post.likes)
        })}
      />
      <span className="badge badge-light">{post.likes.length}</span>
    </button>);

    //Like button redirects to login if not logged in
    const redirectButton=(<Link to='/login'><button
      type="button"
      className="btn btn-light mr-1"
    >
      <i
        className={classnames('fa fa-thumbs-up', {
          'text-info': this.findUserLike(post.likes)
        })}
      />
      <span className="badge badge-light">{post.likes.length}</span>
    </button></Link>);

    // Content if it's an image
    const ImageContent=(<img
    //width ='50px'
    //height = '400px'
      src={"http://localhost:3000/"+post.content}
      alt=""
    />);

    //Content if it's a video
    const VideoContent=(<ReactPlayer
        url={post.content}
        controls
      />);
  // item in all posts display format
    const itemFormat=(<div className="card card-body mb-3">
    <div className="row">
      <div className="col-md-2">
        <a href={linkProfile} style={{textDecoration: 'none'}}>
          <img
            className="rounded-circle d-none d-md-block"
            src={"http://localhost:3000/"+post.avatar}
            alt=""
          />
        <br />
        <p className="text-center" style={{color: "black"}}>By : {post.handle}</p>
        </a>
        <p className="text-center" >Posted in :</p>
        <p className="text-center" ><Moment format="YYYY-MM-DD HH:mm">{post.date}</Moment></p>
      </div>
      <div className="col-md-10">
        <Link to={`/post/${post._id}`} className="text-center" style= {{fontSize:'25px',textDecoration: 'none' , color:'black' }}>
             <p >{post.title}</p>
            </Link>
            {showActions? null : <p className="lead">{post.description}</p>}  
        <div className="lead">{post.type==="Image" ? ImageContent : VideoContent}</div>
          <span>
            {this.props.auth.isAuthentificated? likeButton : redirectButton}
            
            <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
              Comments
              <span style={{marginLeft: '5px'}} className="badge badge-light">{post.comments.length}</span>
            </Link>
            
          </span>
      </div>
    </div>
  </div>);
  // element to display reactions when logged in
    const reactionDisplay=(<div><div className={classnames('form-control form-control-lg', {
      'is-invalid': errors.reactions
    })} 
    
    style={{marginLeft: 'auto' , marginRight: 'auto' , display: 'block' , width: '35%'}}>
  <span>
        <button
          onClick={this.onReactClick.bind(this, post._id,"love")}
          type="button"
         className="btn btn-light mr-1"
        >
          <i
            className={classnames('far fa-grin-hearts', {
              'text-info': this.findUserReact(post.reactions)
            })}
          />
          
          <span className="badge badge-light">{post.nbr_reactions.love}</span>
        </button>
        </span>             
        <span>
        <button
          onClick={this.onReactClick.bind(this, post._id,"wow")}
          type="button"
         className="btn btn-light mr-1"
        >
          <i
            className={classnames('far fa-surprise', {
              'text-info': this.findUserReact(post.reactions)
            })}
          />
          
          <span className="badge badge-light">{post.nbr_reactions.wow}</span>
        </button>
        </span>      
        <span>
        <button
          onClick={this.onReactClick.bind(this, post._id,"sad")}
          type="button"
         className="btn btn-light mr-1"
        >
          <i
            className={classnames('far fa-sad-tear', {
              'text-info': this.findUserReact(post.reactions)
            })}
          />
          
          <span className="badge badge-light">{post.nbr_reactions.sad}</span>
        </button>
        </span>      
        <span>
        <button
          onClick={this.onReactClick.bind(this, post._id,"angry")}
          type="button"
          className="btn btn-light mr-1"
        >
          <i
            className={classnames('far fa-angry', {
              'text-info': this.findUserReact(post.reactions)
            })}
          />
          
          <span className="badge badge-light">{post.nbr_reactions.angry}</span>
        </button>
        </span>      
        <span>
        <button
          onClick={this.onReactClick.bind(this, post._id,"stars")}
          type="button"
          className="btn btn-light mr-1"
        >
          <i
            className={classnames('far fa-grin-stars', {
              'text-info': this.findUserReact(post.reactions)
            })}
          />
          
          <span className="badge badge-light">{post.nbr_reactions.stars}</span>
        </button>
        </span>     
        </div>
        
        {errors.reactions && <div className="invalid-feedback" style={{textAlign: 'center'}}>{errors.reactions}</div>}         
</div>);

// button to login page to appear when user is not logged in instead of reactions

    const loginButton=(<div className="wrapper" style={{textAlign: 'center'}}><Link to='/login'>
    <button type="button" className="btn btn-light">Login first to React</button></Link></div>);


// Single Post details format
  const postFormat =(<div>
    <p className="text-center" style={{fontSize: '35px' , fontFamily: 'Leitura News' , fontStyle: 'italic'}}>{post.title}</p>
  <div className="card card-body mb-3">
  <div className="row">
    <div className="col-md-2">
      <a href={linkProfile}>
        <img
          className="rounded-circle d-none d-md-block"
          src={"http://localhost:3000/"+post.avatar}
          alt=""
        />
      <br />
      <p className="text-center" style={{color: 'black'}}>{post.handle}</p>
      </a>
      <p className="text-center" >Posted in :</p>
        <p className="text-center" ><Moment format="YYYY-MM-DD HH:mm">{post.date}</Moment></p>
    </div>
    <div className="col-md-10">
          {showActions? null : <p className="lead">{post.description}</p>} 
    </div>
  </div>
</div>
    <div className="lead" style={{marginLeft: 'auto' , marginRight: 'auto' , display: 'block' , width: '60%'}}>
    {post.type==="Image" ? ImageContent : VideoContent}</div>

    {this.props.auth.isAuthentificated? reactionDisplay : loginButton}
            
</div>
);
    return (<div>
      {showActions ? itemFormat : postFormat}
    </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  addReaction: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {  addLike , addReaction })(
  PostItem
);
