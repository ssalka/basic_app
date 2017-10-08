import * as _ from 'lodash';
import * as React from 'react';
import * as inflection from 'lodash-inflection';
import * as ReactDOM from 'react-dom';
import AppRouter from './router';
_.mixin(inflection);

ReactDOM.render(<AppRouter />, document.getElementById('root'));
