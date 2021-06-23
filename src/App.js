import React from 'react';
import './App.css';
import Logincomponent from './components/logincomponent/login.component';
import Navbarcomponent from './components/navbarcomponent/navbar.component';
import { AuthProvider } from './contexts/authcontext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Registercomponent from './components/registercomponent/register.component';
import Admindashboardcomponent from './components/admindashboardcomponent/admindashboard.component';
import Showcasecomponent from './components/showcasecomponent/showcase.component';
import Showproductcomponent from './components/showproductcomponent/showproduct.component';
import Cartcomponent from './components/cartcomponent/cart.component';
import Madepurchasescomponent from './components/madepurchasescomponent/madepurchases.component';
import Accountcomponent from './components/accountcomponent/account.component';
import Bottomnavcomponent from './components/bottomnavcomponent/bottomnav.component';
function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbarcomponent />
        <Switch>
        <Route exact path="/" component={Showcasecomponent}/>
         <Route exact path="/show" component={Showproductcomponent}/>
         <Route exact path="/cart" component={Cartcomponent}/>
         <Route exact path="/purchases" component={Madepurchasescomponent}/>
         <Route exact path="/account" component={Accountcomponent}/>
          <Route exact path="/login" component={Logincomponent}/>
          <Route exact path="/register" component={Registercomponent}/>
          <Route exact path="/admindashboard/:section?" component={Admindashboardcomponent}/>
        </Switch>
        <Bottomnavcomponent/>
      </Router>
    </AuthProvider>
  );
}

export default App;
