import axios, { AxiosResponse } from 'axios';
import { call, CallEffect } from 'redux-saga/effects';

export const api = {
  get(path: string): CallEffect {
    return call(() => axios.get(`/api/${path}`).then(({ data }: AxiosResponse) => data));
  },
  post<Body = {}>(path: string, body?: Body): CallEffect {
    return call(() =>
      axios.post(`/api/${path}`, body).then(({ data }: AxiosResponse) => data)
    );
  }
};
