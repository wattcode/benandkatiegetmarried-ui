import React from 'react';  
import MainPage from './mainPage/MainPage';
import LoginPage from './loginPage/LoginPage';
import api from '../api/mockapi';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
        }
    }  

    componentDidMount = async () => {
        this.getPageData();
    }

    getPageData = async () => {
        try{
            const eventPromise = api.eventDetails();
            const guestPromise = api.getGuests();

            const res = await Promise.all([eventPromise, guestPromise]);

            if(res[0].status === 200 || res[1].status === 200)
                console.log(res);
                this.login(true);
        } catch(err) {
            this.login(false);
        }
    }

    login = (state) => {
        this.setState({ loggedIn: state});
    }
       
    handleClick() {
        this.setState(prevState => ({ isToggleOn: !prevState.isToggleOn }));
    }

    render() {
        return (
            <div>
                {
                    (this.state.loggedIn === false) 
                    ? <LoginPage login={() => this.login(true)} /> 
                    : <MainPage getPageData={this.getPageData}/>
                }
            </div>
        )
    }
}

export default App;