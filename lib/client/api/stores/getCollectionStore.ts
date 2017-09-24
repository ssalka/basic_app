declare const _;
import { createStore } from 'lib/client/api/stores';
import { IDocument } from 'lib/client/interfaces';

export default _.memoize(initialState => (
  createStore({
    name: initialState.collection.typeFormats.graphql,
    logUpdates: true,
    initialState: _.defaults(initialState, { documents: [] })
  }, {
    loadDocuments(documents: IDocument[]) {
      this.setState({ documents });
    },
    updateDocument(doc: IDocument) {
      const documents: IDocument[] = this.state.documents.slice();

      const indexToUpdate: number = _.findIndex(documents, { _id: doc._id });

      indexToUpdate >= 0
        ? documents.splice(indexToUpdate, 1, doc)
        : documents.push(doc);

      this.setState({ documents });
    }
  })
));
