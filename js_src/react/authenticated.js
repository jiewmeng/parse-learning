var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var Events = require('./events');

module.exports = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },

  render: function() {
    var user = Parse.User.current();
    var fbLinked = Parse.FacebookUtils.isLinked(user);

    return (
      <div>
        <h1>Hello!!! {user.get('firstName') ? user.get('firstName') : user.get('email')}</h1>

        <a className="btn btn-danger" href="javascript:;" onClick={this.logout}>Logout</a>
        {
          fbLinked ?
          <a className="btn btn-warning" href="javascript:;" onClick={this.unlinkFb}>Unlink Facebook</a> :
          <a className="btn btn-default" href="javascript:;" onClick={this.linkFb}>Link Facebook</a>
        }

        <Events />
      </div>
    );
  },

  logout: function() {
    Parse.User.logOut();
  },

  linkFb: function() {
    Parse.FacebookUtils.link(Parse.User.current(), 'public_profile,email', {
      success: function(user) {
        console.log('linked fb', user);
      },
      error: function(user, err) {
        console.error('failed to link fb', user, err);
      }
    });
  },

  unlinkFb: function() {
    Parse.FacebookUtils.unlink(Parse.User.current());
  },

});
