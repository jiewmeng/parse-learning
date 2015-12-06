var Parse = require('parse');
var React = require('react');
var ReactDOM = require('react-dom');
var ParseReact = require('parse-react');
var validator = require('validator');

/**
 * Handles login/signup
 */
module.exports = React.createClass({
  mixins: [ParseReact.Mixin],

  getInitialState: function() {
    return {
      action: 'Login'
    };
  },

  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },

  render: function() {
    var confirmPassword = null;
    var error = null;

    if (this.state.action === 'Signup') {
      confirmPassword = <p className="form-group">
        <label>Confirm Password</label>
        <input className="form-control" type="password" name="confirm-password"  ref="confirmPassword" />
      </p>;
    }

    if (this.state.error) {
      error = <p className="error">{this.state.error}</p>;
    }

    return (
      <div class="row">
        <div className="col-md-4 col-md-offset-4">
          <h1>{this.state.action}</h1>

          {error}

          <form onSubmit={this.handleSubmit}>
            <p className="form-group">
              <label>Email</label>
              <input className="form-control" type="text" name="email" ref="email" />
            </p>
            <p className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password" ref="password" />
            </p>
            {confirmPassword}
            <p className="form-group">
              <input className="btn btn-primary btn-block" type="submit" value={this.state.action} />
              {
                this.state.action === 'Login' ?
                <a className="btn btn-default btn-block" href="#" onClick={this.toggleAction}>Don't have an account yet? Signup now!</a>
                :
                <a className="btn btn-default btn-block" href="#" onClick={this.toggleAction}>Already have an account? Login instead.</a>
              }
            </p>
          </form>

          <a className="btn btn-primary btn-block" href="javascript:;" onClick={this.loginWithFb}>Login/signup with Facebook</a>

          <hr />

          <form onSubmit={this.forgotPassword}>
            <p className="form-group">
              <label>Forgot password? Enter email to reset</label>
              <input className="form-control" name="forgot-password-email" ref="forgotPasswordEmail" />
            </p>
            <p className="form-group">
              <input className="btn btn-primary btn-block" type="submit" value="Request password reset" />
            </p>
          </form>
        </div>
      </div>
    );
  },

  toggleAction: function(evt) {
    if (this.state.action === 'Login') {
      this.setState({action: "Signup"});
    } else {
      this.setState({action: "Login"});
    }
  },

  handleSubmit: function(evt) {
    evt.preventDefault();

    var email = this.refs.email.value;
    var password = this.refs.password.value;
    var confirmPassword;
    if (this.refs.confirmPassword) confirmPassword = this.refs.confirmPassword.value;

    if (this.state.action === 'Signup') {
      if (email.length === 0) {
        this.setState({error: 'Email is required'});
        return false;
      }

      if (!validator.isEmail(email)) {
        this.setState({error: 'Email is invalid'});
        return false;
      }

      if (this.state.action === 'Signup' && password !== confirmPassword) {
        this.setState({error: 'Passwords do not match'});
        return false;
      }

      var user = new Parse.User();
      user.set('username', email);
      user.set('password', password);
      user.set('email', email);

      console.log('Signing up ...');
      user.signUp(null)
        .then(function(u) {
          console.log('Signup Successful');
        })
        .fail(function(u, err) {
          console.error('Signup fail', user, err);
          self.setState({error: err.message});
        });
    } else {
      console.log('Logging in ...');
      Parse.User.logIn(email, password)
        .then(function(u) {
          console.log('Logged in as', u);
        })
        .fail(function(u, e) {
          console.error('Failed to login', u, e);
          self.setState({error: e.message});
        });
    }
    return false;
  },

  updateProfileFromFb: function() {
    FB.api('/me?fields=email,first_name,last_name', function(res) {
      console.log('fb res', res);
      var user = Parse.User.current();
      user.set('email', res.email);
      user.set('firstName', res.first_name);
      user.set('lastName', res.last_name);
      user.save()
        .then(function() {
          console.log('saved new FB user');
        })
        .fail(function(err) {
          console.error('error saving FB user', err);
        });
    });
  },

  /**
   * Login/signup with facebook. If user is signing up, update profile fields from FB
   */
  loginWithFb: function() {
    var self = this;
    Parse.FacebookUtils.logIn('public_profile,email', {
      success: function(user) {
        if (!user.existed()) {
          self.updateProfileFromFb();
        }
      },
      error: function(user, err) {
        console.error('failed to login', user, err);
      }
    });
  },

  forgotPassword: function(evt) {
    evt.preventDefault();
    var email = this.refs.forgotPasswordEmail.value;
    Parse.User.requestPasswordReset(email, {
      success: function() {
        console.log('Password reset email set to ' + email);
      },
      error: function(err) {
        console.error(err);
      }
    });
    return false;
  }
});
