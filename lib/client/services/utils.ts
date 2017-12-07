import { RequestStatus } from 'lib/common/interfaces/request';

export function action<A = string, P = {}>(type: A, payload = {}) {
  return { type, ...payload };
}

export function success(eventType: string): string {
  return `${eventType}_${RequestStatus.Success}`;
}

export function fail(eventType: string): string {
  return `${eventType}_${RequestStatus.Fail}`;
}
