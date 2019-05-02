import {getConfig} from 'mattermost-redux/selectors/entities/general';
import request from 'superagent';
import {FileTypes} from 'mattermost-redux/action_types';
import {Client4} from 'mattermost-redux/client';

import {id as pluginId} from './manifest';
import {OPEN_ROOT_MODAL, CLOSE_ROOT_MODAL} from './action_types';

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

export function createPost(post, files = []) {
    return (dispatch, getState) => {
        const state = getState();
        const currentUserId = state.entities.users.currentUserId;

        const timestamp = Date.now();
        const newPost = {
            ...post,
            pending_post_id: post.pending_post_id || `${currentUserId}:${timestamp}`,
            create_at: 0,
            update_at: 0,
            file_ids: files.map((file) => file.id),
        };
        Client4.createPost({...newPost, create_at: 0});
    };
}
