declare const _;
declare const React;
import { InputGroup, IInputGroupProps } from '@blueprintjs/core';
import { Link } from 'react-router';

import api from 'lib/client/api';
import { connect, UserStore } from 'lib/client/api/stores';
import { ViewComponent, Button } from 'lib/client/components';
import './styles.less';

const { User } = api;

@connect(UserStore)
class Login extends ViewComponent<any, any> {
  public static contextTypes = {
    appName: React.PropTypes.string,
    user: React.PropTypes.object
  };

  public state = {
    register: false,
    formData: {
      username: '',
      password: '',
      email: ''
    }
  };

  private registerOnSubmit() {
    this.setState({
      register: true
    });
  }

  private handleChange(name: string, value: string) {
    // update input values in state
    const { formData } = this.state;
    formData[name] = value;
    this.setState({ formData });
  }

  get submitRoute(): string {
    return '/'.concat(this.state.register ? 'register' : 'login');
  }

  private handleSubmit(event) {
    event.preventDefault();
    const { formData, register } = this.state;
    const body = _.pick(formData, ['username', 'password']);
    if (register && !!formData.email) {
      body.email = formData.email;
    }

    const path = this.submitRoute;
    this.post(path, body).then(this.loginCallback);
  }

  private loginCallback(response) {
    const { token } = response.body;
    localStorage.token = token;

    // User library is not sent along with login response...
    // TODO: migrate rest of auth endpoints to graphql
    this.props.refetch().then(({ data: {user} }) => {
      if (user) {
        User.set(user);
      }
      this.props.history.push('/home');
    });
  }

  private getInput({name, icon}) {
    const value = this.state.formData[name];
    const props: IInputGroupProps = {
      value,
      placeholder: _.capitalize(name),
      leftIconName: icon,
      onChange: (event: React.FormEvent<any>) => this.handleChange(name, event.currentTarget.value)
    };

    if (name === 'password') {
      props.type = name;
    }

    return <InputGroup {...props} />;
  }

  get text() {
    return {
      header: `Log in to ${this.context.appName}`,
      register: 'Need to register?',
      submit: this.state.register ? 'Register' : 'Log In'
    };
  }

  get inputFields() {
    const inputFields = [
      { name: 'username', icon: 'person' },
      { name: 'password', icon: 'lock' }
    ];

    if (this.state.register) {
      inputFields.push({
        name: 'email', icon: 'envelope'
      });
    }

    return inputFields;
  }

  public render() {
    const { state, text } = this;

    const RegisterLink = () => (
      <Button
        text={text.register}
        onClick={this.registerOnSubmit}
        minimal={true}
        rounded={true}
      />
    );

    return (
      <div id="login" className="view">
        <div className="pt-callout">
          <div className="login-form">
            <h2>{text.header}</h2>

            <form className="pt-control-group pt-vertical" onSubmit={this.handleSubmit}>
              {this.inputFields.map(this.getInput)}
              <Button type="submit" color="primary" text={text.submit} />
            </form>
            <p>{!state.register ? <RegisterLink /> : null}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;