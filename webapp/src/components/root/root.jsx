import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import {CirclePicker} from 'react-color';

import ReactPaint from '../paint';

import styles from './root.css';

function dataURItoFile(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], {type: 'image/png'});
    blob.lastModifiedDate = new Date();
    blob.name = 'drawing.png';
    return blob;
}

export default class Root extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        channelId: PropTypes.string.isRequired,
        rootId: PropTypes.string,
        userId: PropTypes.string.isRequired,
        close: PropTypes.func.isRequired,
        uploadFile: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired,
    };

    state = {
        brushColor: '#000000',
        lineWidth: 2,
        imageData: null,
    };

    constructor(props) {
        super(props);
        this.paintRef = React.createRef();
        this.inputFileRef = React.createRef();
    }

    setColor = (color) => {
        this.setState({brushColor: color});
    }

    setLineWidth = (e) => {
        this.setState({lineWidth: e.target.value});
    }

    handleImage = (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            var img = new Image();
            img.onload = () => {
                this.paintRef.current.setImage(img);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    generateId = () => {
        // implementation taken from http://stackoverflow.com/a/2117523
        var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        id = id.replace(/[xy]/g, (c) => {
            const r = Math.floor(Math.random() * 16);

            let v;
            if (c === 'x') {
                v = r;
            } else {
                v = (r & 0x3) | 0x8;
            }

            return v.toString(16);
        });

        return id;
    }

    uploadDrawing = () => {
        const {channelId, rootId} = this.props;
        const clientId = this.generateId();
        const blob = dataURItoFile(this.state.imageData);
        this.props.uploadFile(blob, 'drawing.png', channelId, rootId, clientId).then((data) => {
            this.props.createPost({
                channel_id: channelId,
                root_id: rootId,
                message: '',
                user_id: this.props.userId,
            }, data.body.file_infos);
            this.props.close();
        });
    }

    render() {
        const {visible, close} = this.props;
        return (
            <Modal
                show={visible}
                onHide={close}
            >
                <Modal.Header
                    closeButton={true}
                >
                    <h4 className='modal-title'>
                        {'Upload drawing'}
                    </h4>
                </Modal.Header>
                <Modal.Body>
                    <CirclePicker
                        styles={{default: {card: {justifyContent: 'space-between'}}}}
                        color={this.state.brushColor}
                        onChangeComplete={this.setColor}
                        circleSize={20}
                        circleSpacing={0}
                        width={568}
                        colors={[
                            '#000000', '#f44336', '#e91e63', '#9c27b0',
                            '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
                            '#00bcd4', '#009688', '#4caf50', '#8bc34a',
                            '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
                            '#ff5722', '#795548',
                        ]}
                    />
                    <div className={styles.brushWidthContainer}>
                        <input
                            type='file'
                            onChange={this.handleImage}
                            ref={this.inputFileRef}
                        />
                        <i
                            className="fa fa-picture-o"
                            onClick={() => this.inputFileRef.current.click()}
                        />
                        <span>{'Brush Width:'}</span>
                        <input
                            type='number'
                            value={this.state.lineWidth}
                            onChange={this.setLineWidth}
                            max={50}
                            min={1}
                            className={styles.number}
                        />
                        <input
                            type='range'
                            value={this.state.lineWidth}
                            onChange={this.setLineWidth}
                            max={50}
                            min={1}
                            className={styles.range}
                        />
                    </div>
                    <div className={styles.paintContainer}>
                        <ReactPaint
                            ref={this.paintRef}
                            brushCol={this.state.brushColor.hex ? this.state.brushColor.hex : '#000000'}
                            lineWidth={this.state.lineWidth}
                            className='react-paint'
                            onDraw={(imageData) => this.setState({imageData})}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className='btn btn-cancel'
                        onClick={close}
                    >
                        {'Cancel'}
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary'
                        disabled={this.state.imageData === null}
                        onClick={this.uploadDrawing}
                    >
                        {'Uplaod'}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
