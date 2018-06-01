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
        this.hideImageModal = this.hideImageModal.bind(this);

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

    analyzeImage(imageUrl) {
        if (!imageUrl) return;

        const tweetId = this.props.tweetObj.id;

        if (!this.props.imageAnalysis[tweetId]) {
            this.props.requestImageAnalysis(tweetId, imageUrl);
        }

        this.setState({
            showImageModal: true
        })
    }

    hideTextModal() {
        this.setState({
            showTextModal: false
        })
    }

    hideImageModal() {
        this.setState({
            showImageModal: false
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
                entities.push("None")
            } else {
                textAnalysis.entities.documents[0].entities.forEach((e) => {
                    entities.push(<a target="_blank" href={e.wikipediaUrl}>{e.name}</a>);
                    entities.push(<br />);
                });
            }

            sentiment = textAnalysis.sentiment.documents[0].score;
        }

        const imageAnalysis = this.props.imageAnalysis[this.props.tweetObj.id];
        let imageTags = [];
        let description = '';
        let isAdult = false;
        let adultScore = '';
        let isRacy = false;
        let racyScore = '';

        if (imageAnalysis) {
            if (imageAnalysis.tags && Array.isArray(imageAnalysis.tags)) {
                imageAnalysis.tags.forEach((t) => {
                    imageTags.push('Tag: ' + t.name + ', Confidence: ' + t.confidence);
                });
            }

            if (imageAnalysis.description && imageAnalysis.description.captions) {
                description = 'Caption: ' + imageAnalysis.description.captions[0].text + ', Confidence: ' + imageAnalysis.description.captions[0].confidence
            } else if (imageAnalysis.description && imageAnalysis.description.tags) {
                imageAnalysis.description.tags.forEach((t) => {
                    description += t + ' ';
                });
            }

            if (imageAnalysis.adult) {
                isAdult = imageAnalysis.adult.isAdultContent;
                isRacy = imageAnalysis.adult.isRacyContent;

                adultScore = imageAnalysis.adult.adultScore;
                racyScore = imageAnalysis.adult.racyScore;
            }
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
                                onClick={() => this.analyzeImage(mediaUrl)}
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
                <Modal show={this.state.showImageModal} onHide={this.hideImageModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Image Analysis</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            imageAnalysis ?
                                <div>
                                    <Image src={mediaUrl} alt="Analyzed Media" responsive />
                                    <h4>Tags</h4>
                                    <ul>
                                        {imageTags.map((t) => {
                                            return <li key={t}>{t}</li>;
                                        })}
                                    </ul>
                                    <h4>Description</h4>
                                    <p>
                                        {description}
                                    </p>
                                    <h4>Adult Content</h4>
                                    <p>
                                        Is Adult? {isAdult ? " True" : " False"}<br />
                                        Is Racy? {isRacy ? " True" : " False"}<br />
                                        Adult Score: {adultScore}<br />
                                        Racy Score: {racyScore}<br />
                                        0 = Rated G, 1 = Rated NC-17
                                    </p>
                                </div>
                                :
                                <img alt="loading..." height={64} width={64} src="/loading.gif" />
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideImageModal}>Close</Button>
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