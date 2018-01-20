import axios, { AxiosResponse } from 'axios';
import produce from 'immer';
import * as _ from 'lodash';
import { connect as reduxConnect } from 'react-redux';
import { ActionCreator, AnyAction, bindActionCreators } from 'redux';
import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';

import { Action, IErrorPayload, Reducer } from 'lib/common/interfaces/redux';
import { RequestStatus } from 'lib/common/interfaces/request';

// usage of `any` should be fixed after typescript PR#13288 is merged
export function action<P = {}>(type: string, payload?: P): Action<P> {
  return { type, ...(payload as any) };
}

type Recipe<S, A> = (state: S, action: A) => void;

export function reducer<S = {}, A = AnyAction>(reduxReducer: Recipe<S, A>): Reducer<S, A> {
  return (state: S, _action: A) => produce<S>(state, nextState => (
    reduxReducer(nextState, _action)
  ));
}

export function success(eventType: string): string {
  return `${eventType}_${RequestStatus.Success}`;
}

export function fail(eventType: string): string {
  return `${eventType}_${RequestStatus.Fail}`;
}

export const saga = {
  get(path: string): CallEffect {
    return call(() => axios.get(`/api/${path}`).then(({ data }: AxiosResponse) => data));
  },
  post<Body = {}>(path: string, body?: Body): CallEffect {
    return call(() =>
      axios.post(`/api/${path}`, body).then(({ data }: AxiosResponse) => data)
    );
  },
  success<Payload = {}>(eventType: string, payload: Payload): PutEffect<Action<Payload>> {
    return put(action(success(eventType), payload));
  },
  fail(eventType: string, payload: IErrorPayload): PutEffect<Action<IErrorPayload>> {
    return put(action(fail(eventType), payload));
  }
};

interface IConnectConfig {
  store?: string;
  stores?: string[];
  actions?: Record<string, ActionCreator<AnyAction>>;
}

// TODO: support passing action string names, option validation
export const connect = (config: IConnectConfig) =>
  reduxConnect(
    state =>
      config.store
        ? state[config.store]
        : config.stores ? _.pick(state, config.stores) : {},
    dispatch => bindActionCreators(config.actions, dispatch)
  );
