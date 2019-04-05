import React from 'react';

import {id as pluginId} from './manifest';

import Root from './components/root';
import {fileUploadMethodAction} from './actions';
import reducer from './reducer';

export default class DemoPlugin {
    initialize(registry, store) {
        registry.registerRootComponent(Root);

        registry.registerFileUploadMethod(
            <i className='icon fa fa-paint-brush'/>,
            () => store.dispatch(fileUploadMethodAction()),
            'Draw',
        );

        registry.registerReducer(reducer);
    }

    uninitialize() {
        //eslint-disable-next-line no-console
        console.log(pluginId + '::uninitialize()');
    }
}
