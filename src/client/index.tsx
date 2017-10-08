declare const _;
declare const React;
import * as inflection from 'lodash-inflection';
import * as ReactDOM from 'react-dom';
import AppRouter from './router';
_.mixin(inflection);

ReactDOM.render(<AppRouter />, document.getElementById('root'));
