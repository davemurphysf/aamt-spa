import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Tweets';
import { Button } from "react-bootstrap";

class Home extends Component {
    constructor(props) {
        super(props);
        this.requestTweets = this.requestTweets.bind(this);
    }
    requestTweets() {
        this.props.requestTweets();
    }
    render() {
        return (
            <div>
                {this.props.auth.loggedIn ?
                    <Button
                        onClick={this.requestTweets}
                        className="btn-social btn-twitter"
                        bsClass="btn"
                        componentClass="a"
                        bsSize="large"
                    >
                        <span className="fa fa-twitter"></span> Fetch Tweets for {this.props.auth.username}
                    </Button>
                    :
                    <Button
                        className="btn-social btn-twitter"
                        bsClass="btn"
                        componentClass="a"
                        bsSize="large"
                        href="/login"
                    >
                        <span className="fa fa-twitter"></span> Login with Twitter
                    </Button>
                }
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);
