import * as _ from 'lodash';
import * as React from 'react';
import { InputGroup, IInputGroupProps } from '@blueprintjs/core';
import { RouteComponentProps } from 'react-router';
import Link from 'react-router-redux-dom-link';

import api from 'lib/client/api';
import { connect, CollectionStore } from 'lib/client/api/stores';
import { ReduxComponent, Button } from 'lib/client/components';
import './styles.less';

const { Collection, User } = api;

export interface IState {
  register: boolean;
  formData: {
    username: string;
    password: string;
    email: string;
  };
}

@connect(CollectionStore)
class Login extends ReduxComponent<RouteComponentProps<any>, IState> {
  public state: IState = {
    register: false,
    formData: {
      username: '',
      password: '',
      email: ''
    }
  };

  componentWillReceiveProps({ history, store }) {
    const { user: currentUser } = this.props.store.user;
    const { user: nextUser } = store.user;

    if (!currentUser && nextUser) {
      Collection.add(nextUser.library.collections);
      history.push('/home');
    }
  }

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
    const payload: Partial<IState['formData']> = _.pick(formData, [
      'username',
      'password'
    ]);

    if (register && !!formData.email) {
      payload.email = formData.email;
    }

    this.props.actions.userLogin(this.submitRoute, payload);
  }

  private getInput({ name, icon }) {
    const value = this.state.formData[name];
    const props: IInputGroupProps = {
      value,
      placeholder: _.capitalize(name),
      leftIconName: icon,
      onChange: (event: React.FormEvent<any>) =>
        this.handleChange(name, event.currentTarget.value)
    };

    if (name === 'password') {
      props.type = name;
    }

    return <InputGroup {...props} />;
  }

  get text() {
    return {
      header: `Log in to ${document.title}`,
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
        name: 'email',
        icon: 'envelope'
      });
    }

    return inputFields;
  }

  public render() {
    const { state, text } = this;

    return (
      <div id="login" className="view">
        <div className="pt-callout">
          <div className="login-form">
            <h2>{text.header}</h2>

            <form
              className="pt-control-group pt-vertical"
              onSubmit={this.handleSubmit}
            >
              {this.inputFields.map(this.getInput)}
              <Button type="submit" color="primary" text={text.submit} />
            </form>
            <p>
              {!state.register && (
                <Button
                  text={text.register}
                  onClick={this.registerOnSubmit}
                  minimal={true}
                  rounded={true}
                />
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
