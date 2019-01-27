import React from 'react';

import {id as pluginId} from './manifest';

import Root from './components/root';
import {fileUploadMethodAction, getStatus} from './actions';
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

        // Immediately fetch the current plugin status.
        store.dispatch(getStatus());

        // Fetch the current status whenever we recover an internet connection.
        registry.registerReconnectHandler(() => {
            store.dispatch(getStatus());
        });
    }

    uninitialize() {
        //eslint-disable-next-line no-console
        console.log(pluginId + '::uninitialize()');
    }
}
