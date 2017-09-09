import React from 'react';
import css from './rsvpForm-styles.css';
import data from './guest-data.js';
import FormData from './FormData.js';

class RsvpForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit.bind(this);
        this.handleChange.bind(this);
        this.state = {
            guest: [],
            submit: null,
            selected: 'meal choice',
            aa: false,
        }
    }

    componentDidMount = () => {
        const guest = [];
        data.names.map(val => {
           return guest.push({name: val, going: null, meal: null})
        })
        guest.push({dietry: 'none', song: 'none'})

        this.setState({
            guest: guest
        })
    }

    handleChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;
        var type = event.target.type;      
        
        if (name === 'dietry' || name === 'song') {
            this.setState((prevState) => {
                var newArr = prevState.guest;
                newArr[name] = value 
                return {guest: newArr}
            })
        }
        else {
            var index = this.state.guest.findIndex(val => {
            return val.name === name 
            })
            
            this.setState((prevState) => {
                var newArr = prevState.guest;
                value === 'no' ? newArr[index].meal = false : newArr[index].meal = null; 
                type === 'radio' ? newArr[index].going = value :newArr[index].meal = value;
                return {guest: newArr}
            })
        } 
    }

    handleSubmit = (event) => {
        var submit = 0;
        this.state.guest.map(val => {
            if (Object.values(val).indexOf(null) > -1) {
                this.setState((prevState) => {
                    return {submit: false}
                })
                submit++;
            }     
            return true; 
        })
       
        if (submit === 0) {
            this.setState((prevState) => {
                return {submit: true}
            })
            this.props.closeForm('validate', this.state.guest);
        }
        event.preventDefault();
    }

    generateData = (val, i) => {
        return (<FormData 
                key={i} 
                name={val} 
                guest={this.state.guest} 
                index={i} 
                handleChange={this.handleChange}
                visibility={this.props.visibility}
                />)
    }

    render() {  
        console.log(this.state.guest);  
        return (
            <div className={[this.props.visibility && css.visible, css.notVisible].join(' ')}>
                <p className={css.heading}> Will you attend? </p>
                <p className={css.subHeading}>Please sign your RSVP</p>
                
                <form className={css.formOutline} onSubmit={this.handleSubmit} >
                    {data.names.map(this.generateData)}
                    
                    {this.state.submit === false 
                    ?<p className={css.warning}>Please ensure all above fields are filled out</p> 
                    :null}
                    
                    <textarea className={css.diet} rows="4" cols="25" name="dietry" onChange={this.handleChange}
                        placeholder="Please notify us of any other dietary requirements..." >
                    </textarea>
                    <p className={css.song}> 
                        What song will get you on the dance floor?
                    </p>
                    <p> 
                        <input className={css.songAns} type="text" placeholder="optional" name="song" onChange={this.handleChange}/>
                    </p>
                    <input className={css.submit} type="submit" value="SIGN RSVP" />

                </form>            
            </div>
        )
    }
}

export default RsvpForm;

