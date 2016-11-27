import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { createConnector } from 'cartiv';

import { User } from 'lib/client/api';
import { UserStore } from 'lib/client/api/stores';
import { ViewComponent } from 'lib/client/components';
import Input from './Input';
import SubmitButton from './SubmitButton';

const connect = createConnector(React);

@connect(UserStore)
class Login extends ViewComponent {
  constructor(props) {
    super(props);
    this.state = {
      register: !!props.register,
      formData: {
        username: '',
        password: '',
        email: ''
      }
    };
  }

  static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  }

  registerOnSubmit() {
    this.setState({
      register: true
    });
  }

  handleChange(event) {
    // update input values in state
    const { name, value } = event.target;
    const { formData } = this.state;
    formData[name] = value;
    this.setState({ formData });
  }

  get submitRoute() {
    return '/'.concat(this.state.register ? 'register' : 'login');
  }

  handleSubmit(event) {
    event.preventDefault();
    const { formData, register } = this.state;
    const body = _.pick(formData, ['username', 'password']);
    if (register && !!formData.email) {
      body.email = formData.email;
    }

    const path = this.submitRoute;
    this.post(path, body).then(this.loginCallback);
  }

  loginCallback(response) {
    const { user, token } = response.body;
    localStorage.token = token;
    localStorage.user = JSON.stringify(user);
    User.set(user);
    this.props.history.push('/home');
  }

  renderInputs() {
    const style = {
      width: "210px",
      height: '30px',
      display: 'block',
      margin: '10px 0',
      paddingLeft: '10px',
      border: '0',
      backgroundColor: '#DDD',
      borderRadius: '3px'
    };

    const { formData, register } = this.state;
    const inputs = ['username', 'password'];
    if (register) inputs.push('email');

    return inputs
      .map(getProps)
      .map(props =>
        <Input {...props} />
      );

    function getProps(name) {
      const type = name === 'password' ? 'password' : 'text';
      const [key, value] = [name, formData[name]];
      return { name, type, style, key, value };
    }
  }

  get helpers() {
    return {
      text: {
        header: `Log in to ${this.context.appName}`,
        logInAsUser: `Log In as ${_.get(this.state, 'user.username')}?`,
        register: 'Need to register?',
        submit: this.state.register ? 'Register' : 'Log In'
      },
      styles: {
        login: {
          width: '220px'
        },
        submit: {
          width: '100%',
          height: '30px',
          lineHeight: '30px',
          backgroundColor: '#443366',
          color: 'white',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '3px'
        },
        registerLink: {
          textAlign: 'center',
          marginTop: '10px'
        }
      }
    };
  }

  render() {
    const { state } = this;
    const { text, styles } = this.helpers;

    const LogInAsUser = (
      <Link to="/home">
        {text.logInAsUser}
      </Link>
    );

    const RegisterLink = (
      <div onClick={this.registerOnSubmit}
        style={styles.registerLink}>
        {text.register}
      </div>
    );

    return (
      <div style={styles.login}>
        <h2>{text.header}</h2>
        {state.user ? LogInAsUser : null}

        <form onChange={this.handleChange}
          onSubmit={this.handleSubmit}>
          {this.renderInputs()}
          <SubmitButton text={text.submit} style={styles.submit} />
        </form>

        {!state.register ? RegisterLink : null}
      </div>
    );
  }
};

module.exports = Login;
