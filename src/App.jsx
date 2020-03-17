import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dictionary from './screens/Dictionary';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Auth from './plugins/Auth';

export default class App extends Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Auth>
              <Switch>
                <Route exact path="/chat" component={Dictionary} />
                <Route render={() => <h1>error.</h1>} />
              </Switch>
            </Auth>
            <Route exact path="/chat" component={SignIn} />
          </Switch>
        </Router>
      </div>
    );
  }
}