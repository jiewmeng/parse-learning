var Parse = require('parse');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./react/app');

Parse.initialize('jxLgCrswyCx8OlGMEkaQddne1qqfRzRSPCQbJqx9', 'KdF0aFwhfDvXv5Mmqe7CffpFsmYIHj3p2GFcfqEM');

window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({
    appId      : '1134892519911788',
    // status     : true,
    cookie     : true,
    xfbml      : true,
    version    : 'v2.5'
  });
};

(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

ReactDOM.render(<App />, document.getElementById('app'));
