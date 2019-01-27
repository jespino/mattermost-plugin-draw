import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ReactPaint extends Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object.isRequired,
        height: PropTypes.number,
        width: PropTypes.number,
        brushCol: PropTypes.string,
        lineWidth: PropTypes.number,
        onDraw: PropTypes.func,
    };
    static defaultProps = {
        className: 'react-paint',
        style: {},
        height: 500,
        width: 500,
        brushCol: '#ff6347',
        onDraw: () => null,
    };

    constructor(...props) {
        super(...props);

        this.state = {
            mouseDown: false,
            mouseLoc: [0, 0],
        };
        this.canvas = React.createRef();
    }

    getContext = () => {
        const {brushCol, lineWidth} = this.props;

        const context = this.canvas.current.getContext('2d');
        context.lineWidth = lineWidth;
        context.strokeStyle = brushCol;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        return context;
    }

    getBB = () => this.canvas.current.getBoundingClientRect();

    mouseDown = (e) => {
        const context = this.getContext();
        if (!this.state.mouseDown) {
            this.setState({mouseDown: true});
            context.beginPath();
        }

        this.setState({
            mouseLoc: [e.pageX || e.touches[0].pageX, e.pageY || e.touches[0].pageY],
        });

        const bb = this.getBB();
        context.moveTo(
            (e.pageX || e.touches[0].pageX) - bb.left,
            (e.pageY || e.touches[0].pageY) - bb.top
        );
    }

    mouseUp = () => {
        this.setState({mouseDown: false});
        const context = this.getContext();
        context.closePath();
    }

    mouseMove = (e) => {
        if (this.state.mouseDown) {
            // prevent IOS scroll when drawing
            if (e.touches) {
                e.preventDefault();
            }

            const bb = this.getBB();
            if (
                (e.pageX || e.touches[0].pageX) > bb.left &&
                (e.pageY || e.touches[0].pageY) < (bb.top + this.props.height)
            ) {
                const context = this.getContext();
                context.lineTo(
                    ((e.pageX || e.touches[0].pageX) - bb.left),
                    ((e.pageY || e.touches[0].pageY) - bb.top)
                );

                context.stroke();
            }
        }
    }

    onDraw = () => {
        this.props.onDraw(this.canvas.current.toDataURL());
    }

    render() {
        const {
            width,
            height,
            style,
            className,
        } = this.props;

        return (
            <div className={className}>
                <canvas
                    ref={this.canvas}
                    className={`${className}__canvas`}

                    width={width}
                    height={height}

                    onClick={this.onDraw}

                    style={
                        Object.assign({}, style, {
                            width: this.props.width,
                            height: this.props.height,
                        })
                    }

                    onMouseDown={this.mouseDown}
                    onTouchStart={this.mouseDown}

                    onMouseUp={this.mouseUp}
                    onTouchEnd={this.mouseUp}

                    onMouseMove={this.mouseMove}
                    onTouchMove={this.mouseMove}
                />
            </div>
        );
    }
}
