export type ID = string;

export interface IDocument<ModelName = string> {
  _id: ID;
  _model: ModelName;
  updatedAt: string;
  createdAt: string;
}

export type Identifiable<T> = T & {
  _id: ID;
};

export type Timestamped<T> = T & {
  timestamp: Date;
};

export type Versioned<T> = T & {
  version: number;
};

export type Recorded<T> = Timestamped<T> & Versioned<T>;
