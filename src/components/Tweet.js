import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Tweets';
import { Image, Row, Col, Button, Modal } from "react-bootstrap";

class Tweet extends Component {
    constructor(props) {
        super(props);

        this.analyzeText = this.analyzeText.bind(this);
        this.analyzeImage = this.analyzeImage.bind(this);
        this.hideTextModal = this.hideTextModal.bind(this);

        this.state = {
            showTextModal: false,
            showImageModal: false
        }
    }

    analyzeText() {
        const tweetId = this.props.tweetObj.id;

        if (!this.props.textAnalysis[tweetId]) {
            this.props.requestTextAnalysis(this.props.tweetObj);
        }

        this.setState({
            showTextModal: true
        })
    }

    analyzeImage() {

    }

    hideTextModal() {
        this.setState({
            showTextModal: false
        })
    }

    render() {
        let mediaUrl = '';

        if (this.props.tweetObj.extended_entities && this.props.tweetObj.extended_entities.media && Array.isArray(this.props.tweetObj.extended_entities.media) && this.props.tweetObj.extended_entities.media.length > 0) {
            mediaUrl = this.props.tweetObj.extended_entities.media[0].media_url_https;
        }

        const textAnalysis = this.props.textAnalysis[this.props.tweetObj.id];
        let keyPhrases = '';
        let sentiment = '';
        let entities = [];

        if (textAnalysis) {
            if (textAnalysis.keyPhrases.documents[0].keyPhrases.length === 0) {
                keyPhrases = 'None';
            } else {
                textAnalysis.keyPhrases.documents[0].keyPhrases.forEach((k) => {
                    keyPhrases += k;
                    keyPhrases += ' ';
                });
            }

            if (textAnalysis.entities.documents[0].entities.length === 0) {
                entities.push(<p>None</p>)
            } else {
                textAnalysis.entities.documents[0].entities.forEach((e) => {
                    entities.push(<a target="_blank" href={e.wikipediaUrl}>{e.name}</a>);
                    entities.push(<br />);
                });
            }

            sentiment = textAnalysis.sentiment.documents[0].score;
        }

        return (
            <div className="tweet-row">
                <Row>
                    <Col sm={2}>
                        <img src={this.props.tweetObj.user.profile_image_url_https} alt="Profile" />
                    </Col>
                    <Col sm={8}>
                        <p>
                            {this.props.tweetObj.text}
                        </p>
                    </Col>
                    <Col sm={2}>
                        <Button
                            onClick={this.analyzeText}
                            bsClass="btn"
                            bsStyle="success"
                        >
                            Analyze Text
                        </Button>
                    </Col>
                </Row>
                {mediaUrl &&
                    <Row>
                        <Col sm={8} smOffset={2}>
                            <Image src={mediaUrl} alt="Media" responsive />
                        </Col>
                        <Col sm={2}>
                            <Button
                                onClick={this.requestTweets}
                                bsClass="btn"
                                bsStyle="info"
                            >
                                Analyze Image
                        </Button>
                        </Col>
                    </Row>
                }
                <Modal show={this.state.showTextModal} onHide={this.hideTextModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Text Analysis</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            textAnalysis ?
                                <div>
                                    <h3>Text</h3>
                                    <p>
                                        {this.props.tweetObj.text}
                                    </p>
                                    <h4>Key Phrases</h4>
                                    <p>
                                        {keyPhrases}
                                    </p>
                                    <h4>
                                        Entities
                                    </h4>
                                    <p>
                                        {entities}
                                    </p>
                                    <h4>
                                        Sentiment Score
                                    </h4>
                                    <p>
                                        {sentiment}<br />
                                        0 = Negative, 1 = Positive
                                    </p>
                                </div>
                                :
                                <img alt="loading..." height={64} width={64} src="/loading.gif" />
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideTextModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => state.tweets,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Tweet);