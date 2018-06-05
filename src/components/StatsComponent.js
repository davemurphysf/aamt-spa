import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Stats';
import { Col } from "react-bootstrap";

class StatsComponent extends Component {
    render() {
        const usernames = Object.keys(this.props.usernames);

        usernames.sort((a, b) => { return this.props.usernames[b] - this.props.usernames[a]; })

        const usernameComponents = [];

        usernames.forEach(u => {
            usernameComponents.push(<li key={u} className="list-group-item"><span className="badge">{this.props.usernames[u]}</span>{u}</li>)
        });

        return (
            <Col sm={4}>
                Connected to SignalR: {' '}
                {this.props.signalRConnected &&
                    <i className="fa fa-circle fa-lg text-success" aria-hidden="true"></i>
                }
                {this.props.signalRConnecting &&
                    <i className="fa fa-circle fa-lg text-warning" aria-hidden="true"></i>
                }
                {!this.props.signalRConnected && !this.props.signalRConnecting &&
                    <i className="fa fa-circle fa-lg text-danger" aria-hidden="true"></i>
                }
                {this.props.signalRConnected &&
                    <div>
                        <h3>Stats</h3>
                        Sign-ins: {' ' + this.props.signIns}
                        <br />
                        Tweet Text Analyzed: {' ' + this.props.textAnalyzed}
                        <br />
                        Tweet Images Analyzed: {' ' + this.props.picturesAnalyzed}
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
}


export default connect(
    state => state.stats,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(StatsComponent);
