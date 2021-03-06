import React from 'react';
import Vivus from 'vivus';
import { toast } from 'react-toastify';

import api from '../../api/mockapi';
import Button from '../common/Button';
import css from './loginPage.css';
import loadingImg from './images/loading.svg';

import App from '../App';

class LoginPage extends React.Component {
    constructor(props){
        super(props);
    
        this.state = {
            securityCode : '',
            password : '',
            enterCodeMessage: 'Please enter your unique code below:',
            showLoader: false,
            fadeOut: false,
        }
    }
    
    componentDidMount = () => {
        this.duration = 400; 
        this.animation = new Vivus('loader', {duration: this.duration, start: 'manual'});    
    }

    inputChange = (e) => {
        const input = e.target.value;
        const id = e.target.id;

        this.setState(prev => ({
            securityCode: id === 'securityCode' ? input : prev.securityCode,
            password: id === 'password' ? input : prev.password,
        }));
    }

    enter = (e) => {
        if(e.key === "Enter"){
            this.login();
        }
    }

    incrementloaderPerc = () => {
        if(this.state.loadPercentage === 99){
            clearInterval(this.loaderInterval);
            this.loaderCompleted = true;
        }
        this.setState((prev) => ({
            loadPercentage : prev.loadPercentage + 1
        }));
    }

    toggleLoader = () => {     
        this.setState(prev => {
            const showLoader = !prev.showLoader;

            if(showLoader){
                this.loaderInterval = setInterval(this.incrementloaderPerc, this.duration / 6);
            } else {
                clearInterval(this.loaderInterval);
            }
            
            return { 
                showLoader: showLoader,
                loadPercentage: 1
            }
        })
    }

    login = async () => {
        
        try {

            const req = api.guestLogin(this.state.securityCode, this.state.password, 1);

            this.animation.play();
            this.toggleLoader();
        
            const res = await req;
            this.handleResponse(res); 
        
        } catch(err){
            this.animation.stop();
            this.animation.reset();
            this.toggleLoader();
            this.handleError(err);
        }   
    }

    handleError = (err) => { 
        const message = (err.response && err.response.data && err.response.data.ErrorMessage) || err.message; 

        toast.error(`Ooops, cannot find invite.\n 
        Please ensure code is entered exactly as received by email.\n 
        If you are still having problems, contact Ben and Katie.`, {className: css.toast})
    }

    handleResponse = async (res) => {
        this.interval = setInterval(() => {
            if(this.loaderCompleted) {
                clearInterval(this.interval);
                this.setState({ fadeOut: true });
                setTimeout(this.props.login, 1000);
            }
        }, 100);
    }

    render() {  
        const formClasses = this.state.showLoader ? [css.form, css.loginAttempt] : [css.form];
        const catClasses = this.state.showLoader ? [css.cat, css.loginAttempt] : [css.cat];
        const loginClasses = this.state.fadeOut ? [css.loginPane, css.fadeOut] : [css.loginPane];

        return (
            <div className={loginClasses.join(' ')}>
                <form onKeyUp={this.enter} className={formClasses.join(' ')}>
                    <h2 className={css.prompt}>{this.state.enterCodeMessage}</h2>
                    <div className={css.input} >
                        <input id='securityCode' className={css.securityCode} onChange={this.inputChange} value={this.state.securityCode} type='password'/>
                    </div>
                    <h2 className={css.dash}>-</h2> 
                    <div className={css.input}>
                        <input id='password' className={css.password} onChange={this.inputChange} value={this.state.password} type='password'/>
                    </div>
                    <Button id={css.loginBtn} onClick={this.login} text={'Login'}/>
                </form>
                <div className={catClasses.join(' ')}>
                    <object className={css.loader} id="loader" type="image/svg+xml" data={loadingImg}></object>
                    <h2 className={css.perc}>{this.state.loadPercentage}%</h2>  
                </div>          
            </div>    
        )
    }
}

export default LoginPage;