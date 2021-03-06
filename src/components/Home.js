import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Tweets';
import { Button, Row, Col, Form, FormGroup, FormControl, InputGroup } from "react-bootstrap";
import Tweet from "./Tweet";

class Home extends Component {
    constructor(props) {
        super(props);
        this.requestTweets = this.requestTweets.bind(this);
        this.onType = this.onType.bind(this);

        this.state = {
            username: ''
        }
    }
    onType(e) {
        this.setState({
            username: e.target.value
        })
        e.preventDefault();
    }
    requestTweets(e) {
        if (!this.props.tweets.isLoading) {
            this.props.requestTweets(this.state.username);
        }
        e.preventDefault();
    }
    render() {
        const tweetJson = [];

        for (const t in this.props.tweets.tweets) {
            if (this.props.tweets.tweets.hasOwnProperty(t)) {
                tweetJson.push(this.props.tweets.tweets[t]);
            }
        }

        tweetJson.sort((a, b) => {
            if (a.timestamp === b.timestamp) return 0;
            if (a.timestamp < b.timestamp) return 1;
            return -1;
        });

        const tweets = tweetJson.map(t => <Tweet key={t.id} tweetObj={t} />);

        return (
            <div>
                <Row>
                    <Col sm={6} smOffset={3}>
                        <Form onSubmit={this.requestTweets}>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroup.Addon>@</InputGroup.Addon>
                                    <FormControl
                                        type="text"
                                        placeholder="i.e. KimKardashian, Levie, ElonMusk"
                                        onChange={this.onType}
                                    />
                                    <InputGroup.Button>
                                        <Button
                                            onClick={this.requestTweets}
                                            className="btn-twitter"
                                            bsClass="btn"
                                        >
                                            <span className="fa fa-twitter"></span>
                                        </Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col sm={3}>
                        {this.props.tweets.isLoading &&
                            <img className="pull-right" alt="loading..." height={64} width={64} src="/loading.gif" />
                        }
                    </Col>
                </Row>
                {tweets}
            </div >
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);
