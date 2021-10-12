import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import authRoutes from '../routes/authRoutes.js';

class LoginLayout extends React.Component {
  toLocaleString() {
    return super.toLocaleString();
  }
  render() {
    return (
      <div className="authentications">
        <Switch>
          {authRoutes.map((prop, key) => {
            if (prop.redirect)
              return (
                <Redirect from={prop.path} to={prop.pathTo} key={key} />
              );
            return (  
              <Route path={prop.path} component={prop.component} key={key} />
            );
          })}
        </Switch>
      </div>
    )
  }
}
export default LoginLayout;    