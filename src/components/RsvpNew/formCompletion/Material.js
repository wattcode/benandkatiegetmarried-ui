import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import CheckIcon from 'material-ui-icons/Check';
import css from './thankyouMessage-styles.css';

const styles = {
  wrapper: {
    position: 'relative',
  },
  successButton: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  progress: {
    color: green[500],
    position: 'absolute',
    top: -2,
    left: -2,
  },
};

class CircularFab extends React.Component {
  state = {
    loading: false,
    success: false,
    visibility: false,
    finished: false,
  };

  componentDidMount() {
    this.handleButtonClick();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  handleButtonClick = () => {
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              success: true,
              visibility: true,
              finished: true,
            });    
          }, 1000);
        },
      );
    }
  };

  complete = () => {
    clearTimeout(this.timer);
  }

  timer = undefined;

  render() {
    const { loading, success } = this.state;
    const classes = this.props.classes;
    let buttonClass = '';

    if (success) {
      buttonClass = classes.successButton;
    }

    return (
      <div className={[this.state.visibility && css.hidden, css.position].join(' ')}>
        {this.state.finished ? this.complete() : null}
        <Button fab color="primary" className={buttonClass} >
          {success ? <CheckIcon /> :  <i  className={['fa fa-envelope-o', css.icon].join(' ')} aria-hidden='true'/>}
        </Button>
        {loading && <CircularProgress size={70} className={classes.progress} />}
      </div>
    );
  }
}

CircularFab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularFab);