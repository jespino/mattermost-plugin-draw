import {getConfig} from 'mattermost-redux/selectors/entities/general';
import request from 'superagent';
import {FileTypes} from 'mattermost-redux/action_types';
import {Client4} from 'mattermost-redux/client';

import {id as pluginId} from './manifest';
import {STATUS_CHANGE, OPEN_ROOT_MODAL, CLOSE_ROOT_MODAL} from './action_types';

export const openRootModal = () => (dispatch) => {
    dispatch({
        type: OPEN_ROOT_MODAL,
    });
};

export const closeRootModal = () => (dispatch) => {
    dispatch({
        type: CLOSE_ROOT_MODAL,
    });
};

export const fileUploadMethodAction = openRootModal;

// TODO: Move this into mattermost-redux or mattermost-webapp.
export const getPluginServerRoute = (state) => {
    const config = getConfig(state);

    let basePath = '/';
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;

        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }

    return basePath + '/plugins/' + pluginId;
};

export const getStatus = () => async (dispatch, getState) => {
    fetch(getPluginServerRoute(getState()) + '/status').then((r) => r.json()).then((r) => {
        dispatch({
            type: STATUS_CHANGE,
            data: r.enabled,
        });
    });
};

export const websocketStatusChange = (message) => (dispatch) => dispatch({
    type: STATUS_CHANGE,
    data: message.data.enabled,
});

export function uploadFile(file, name, channelId, rootId, clientId) {
    return (dispatch) => {
        dispatch({type: FileTypes.UPLOAD_FILES_REQUEST});

        return request.
            post(Client4.getFilesRoute()).
            set(Client4.getOptions().headers).
            attach('files', file, name).
            field('channel_id', channelId).
            field('client_ids', clientId).
            accept('application/json');
    };
}
