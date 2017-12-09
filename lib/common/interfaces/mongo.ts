export type ID = string;

export interface IDocument<ModelName = string> {
  _id: ID;
  _model: ModelName;
  updatedAt: string;
  createdAt: string;
}
