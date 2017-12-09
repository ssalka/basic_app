import axios, { AxiosResponse } from 'axios';
import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';

import { Action } from 'lib/common/interfaces/redux';
import { RequestStatus } from 'lib/common/interfaces/request';

interface IErrorPayload {
  error: string | Error;
}

// usage of `any` should be fixed after typescript PR#13288 is merged
export function action<P = {}>(type: string, payload?: P): Action<P> {
  return { type, ...(payload as any) };
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
