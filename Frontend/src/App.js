import { Switch, Route, withRouter } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import './app.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
