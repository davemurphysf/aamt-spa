import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Tweets';
import { Col } from "react-bootstrap";

class StatsComponent extends Component {
    render() {
        const usernames = Object.keys(this.props.stats.usernames);

        usernames.sort((a, b) => { return this.props.stats.usernames[b] - this.props.stats.usernames[a]; })

        const usernameComponents = [];

        usernames.forEach(u => {
            usernameComponents.push(<li key={u} onClick={this.requestTweets.bind(this, u)} className="list-group-item"><span className="badge" >{this.props.stats.usernames[u]}</span>{u}</li>)
        });

        return (
            <Col sm={4}>
                Connected to SignalR: {' '}
                {this.props.stats.signalRConnected &&
                    <i className="fa fa-circle fa-lg text-success" aria-hidden="true"></i>
                }
                {this.props.stats.signalRConnecting &&
                    <i className="fa fa-circle fa-lg text-warning" aria-hidden="true"></i>
                }
                {!this.props.stats.signalRConnected && !this.props.stats.signalRConnecting &&
                    <i className="fa fa-circle fa-lg text-danger" aria-hidden="true"></i>
                }
                {this.props.stats.signalRConnected &&
                    <div>
                        <h3>Stats</h3>
                        Sign-ins: {' ' + this.props.signIns}
                        <br />
                        Tweet Text Analyzed: {' ' + this.props.stats.textAnalyzed}
                        <br />
                        Tweet Images Analyzed: {' ' + this.props.stats.picturesAnalyzed}
                        {usernameComponents.length > 0 &&
                            <div>
                                <h4>Tweets Fetched</h4>
                                <ul className="list-group">
                                    {usernameComponents}
                                </ul>
                            </div>
                        }
                    </div>
                }
            </Col>
        );
    }
    requestTweets(username) {
        if (!this.props.tweets.isLoading) {
            this.props.requestTweets(username);
        }
        // e.preventDefault();
    }
}


export default connect(
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(StatsComponent);
