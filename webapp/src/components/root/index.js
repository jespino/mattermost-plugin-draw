import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {createPost} from 'mattermost-redux/actions/posts';

import {closeRootModal, uploadFile} from 'actions';
import {isRootModalVisible} from 'selectors';

import Root from './root';

const mapStateToProps = (state) => ({
    visible: isRootModalVisible(state),
    channelId: getCurrentChannelId(state),
    rootId: state.views.rhs.selectedPostId,
    userId: getCurrentUserId(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    close: closeRootModal,
    uploadFile,
    createPost,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Root);
