declare const _;
import axios from 'axios';
import { createStore } from 'lib/client/api/stores';
import { IDocument } from 'lib/common/interfaces';

export default _.memoize(initialState => (
  createStore({
    name: initialState.collection.typeFormats.pascalCase,
    logUpdates: true,
    initialState: _.defaults(initialState, {
      documents: [],
      loading: true
    })
  }, {
    getDocuments() {
      return this.state.documents;
    },
    loadDocuments() {
      const { _id } = this.state.collection;

      return axios
        .get(`/api/collections/${_id}/documents`)
        .then(({ data: documents }) => (
          this.loadDocumentsSuccess(documents),
          documents
        ))
        .catch(console.error);
    },
    loadDocumentsSuccess(documents: IDocument[]) {
      this.setState({ documents, loading: false });
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
