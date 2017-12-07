export type ID = string;

export interface IDocument {
  _id: ID;
  _model: string;
  updatedAt: string;
  createdAt: string;
}
