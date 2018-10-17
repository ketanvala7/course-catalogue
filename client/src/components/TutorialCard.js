import React from 'react';
import { Card, Tag, Skeleton, Tooltip, Icon, Row, Col, Button, message, Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addToFavorites, removeFromFavorites, clearMessage } from '../actions/userActions';
import { getUserProfile } from '../actions/authActions';

import '../styles/TutorialCard.css';

class TutorialCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			upvote: false
		};

		this.changeUpvoteColor = this.changeUpvoteColor.bind(this);
		this.addToFavorites = this.addToFavorites.bind(this);
		this.removeFromFavorites = this.removeFromFavorites.bind(this);
	}

	addToFavorites() {
		if (!this.props.auth.authenticated) {
			return message.info('You need to login to add to favorites');
		}

		this.props.addToFavorites(this.props.tutorial._id);
		message.success('Tutorial added to favorites');
		this.props.getUserProfile();
		setTimeout(() => this.props.clearMessage(), 3000);
	}

	removeFromFavorites() {
		this.props.removeFromFavorites(this.props.tutorial._id);
		message.success('Tutorial removed from favorites');
		this.props.getUserProfile();
		setTimeout(() => this.props.clearMessage(), 3000);
	}

	changeUpvoteColor() {
		const upvote = this.state.upvote;
		this.setState({ upvote: !upvote });
	}

	render() {
		const colors = [
			'#8443de',
			'#ff46ab',
			'#69e52c',
			'#fc972b',
			'#fd313c',
			'#f5f29',
			'#ffb420',
			'#a6e509',
			'#2295ff',
			'#3359f5',
			'#04caca'
		];
		let tags;
		if (this.props.tutorial.tags) {
			tags = this.props.tutorial.tags.map((tag, i) => (
				<Tag key={i} color={colors[i % colors.length]}>
					{tag}
				</Tag>
			));
		} else {
			tags = null;
		}

		let favorite = false;
		if (this.props.auth.userProfile.favorites) {
			this.props.auth.userProfile.favorites.forEach(tutorial => {
				if (this.props.tutorial._id === tutorial._id) favorite = true;
			});
		}

		return (
			<Card className="tutorial-card">
				<Skeleton loading={!this.props.tutorial} active>
					<div className="card-title">
						{/* <div className="upvotes">
							<div
								className="upvote-icon"
								onClick={this.changeUpvoteColor}
								className={this.state.upvote ? 'upvoted' : ''}
							>
								<Icon type="caret-up" theme="outlined" />
							</div>
							<Tooltip placement="left" title="Upvotes">
								<small>4</small>
							</Tooltip>
						</div> */}
						<Tooltip placement="topLeft" title="Click here for more info">
							<span
								className="tutorial-name"
								onClick={() =>
									this.props.history.push(`/tutorials/${this.props.tutorial._id}`)
								}
							>
								{this.props.tutorial.title}
							</span>
						</Tooltip>
					</div>
					<Row gutter={8}>
						<Col span={8}>
							<div className="card-entries">Medium : {this.props.tutorial.medium}</div>
						</Col>
						<Col span={8}>
							<div className="card-entries">Type : {this.props.tutorial.type}</div>
						</Col>
						<Col span={8}>
							<div className="card-entries">Skill Level : {this.props.tutorial.skillLevel}</div>
						</Col>
					</Row>
					<div className="card-entries">{tags}</div>
					{!favorite ? (
						<Button type="primary" className="favorite-button" onClick={this.addToFavorites}>
							Add to Favorites
						</Button>
					) : (
						<Popconfirm
							placement="top"
							title="Remove from favorites?"
							okText="Yes"
							cancelText="Cancel"
							icon={<Icon type="question-circle" theme="outlined" />}
							onConfirm={this.removeFromFavorites}
						>
							<Button type="danger" className="remove-favorite-button">
								Remove from Favorites
							</Button>
						</Popconfirm>
					)}
				</Skeleton>
			</Card>
		);
	}
}

TutorialCard.propTypes = {
	auth: PropTypes.object.isRequired,
	addToFavorites: PropTypes.func.isRequired,
	removeFromFavorites: PropTypes.func.isRequired,
	clearMessage: PropTypes.func.isRequired,
	getUserProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ addToFavorites, removeFromFavorites, clearMessage, getUserProfile }
)(withRouter(TutorialCard));
