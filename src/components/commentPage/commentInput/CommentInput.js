import React from 'react'
import Picker from 'react-emojipicker'

import Button from '../../common/Button';
import css from './commentInput.css';

class CommentInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
            guests: [],
            activeInput: props.defaultState,
            text: props.text || '',
            attribution: [],
            showPicker: false
        }
    }

    inputChange = (e) => {
        this.setState({
            text: e.target.value
        });
    }

    toggleInput = (val) => { 
        if(val !== this.state.activeInput){
            this.setState(prev => ({
                activeInput: val, 
                showPicker: false
            }));
        }
    } 

    componentDidMount = () => {
        document.addEventListener("mousedown", this.clickOutside);
    }

    componentWillUnmount = () => {
        document.removeEventListener("mousedown", this.clickOutside);
    }

    componentDidUpdate = () => {
        this.input && this.input.focus();
    }

    clickOutside = (e) => {
        if(this.container && !this.container.contains(e.target)){
            this.toggleInput(false);
        }
    }
    
    addEmoji = (emoji) => {
        this.setState(prev => ({
            text: prev.text.concat(emoji.unicode),
            showPicker: false,
        }));
    }

    togglePicker = (val) => {
        this.setState(prev => ({
            showPicker: val ? val : !prev.showPicker
        }));
    }

    post = () => {
        this.setState({
            activeInput: false,
            text: [],
            attribution: [],
            pickerVisible: false
        })
        this.props.post(this.state.text, this.state.attribution)
    }

    render() { 
    const inputClasses = this.state.activeInput ? [css.inputComment, css.active] : [css.inputComment];
    const showPicker = this.state.showPicker ? [css.picker, css.show] : [css.picker];
    const input = this.state.activeInput && <textarea className={css.input}
                                                    ref={(i) => this.input = i}
                                                    onChange={this.inputChange}
                                                    onFocus={this.focus}
                                                    value={this.state.text}></textarea>
        return (
            <div ref={i => this.container = i} >
                <div className={inputClasses.join(' ')} 
                    onClick={() => this.toggleInput(true)}>
                    <div className={css.textarea}>
                        <p>Leave a note</p>
                        {input}
                    </div>
                    <div>                
                        {this.state.guests.map(g => <span>{`${g.firstName} ${g.lastName}`}</span>)}
                    </div>
                    <Button className={css.post} 
                            onClick={this.post} 
                            text='Post'/>
                    <i className={['fa fa-smile-o', css.emoji].join(' ')} onClick={this.togglePicker}/>
                </div>
                <div className={showPicker.join(' ')}>
                    <Picker onEmojiSelected={this.addEmoji}/>
                </div>
            </div>
        )
    }
}

export default CommentInput;