'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _blacklist = require('blacklist');

var _blacklist2 = _interopRequireDefault(_blacklist);

var _reactMotion = require('react-motion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PullToRefresh = _react2.default.createClass({
    displayName: 'PullToRefresh',
    getInitialState: function getInitialState() {
        return {
            loading: false,
            refreshable: false
        };
    },

    propTypes: {
        distanceToRefresh: _react.PropTypes.number,
        resistance: _react.PropTypes.number,
        onRefresh: _react.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            distanceToRefresh: 50,
            resistance: 0.5,
            onRefresh: function onRefresh() {
                return new Promise(function (resolve, reject) {});
            }
        };
    },
    handleRefresh: function handleRefresh() {
        var loadingPromise = this.props.onRefresh();
        // Once actual loading is complete, reset pull to refresh
        loadingPromise.then(this.onRefreshEnd);
    },
    onRefreshEnd: function onRefreshEnd() {
        console.log('onRefreshEnd');
        this.setState({
            loading: false,
            refreshable: false
        });
    },
    handleTouchStart: function handleTouchStart(event) {
        var touch = event.touches[0];
        this.startX = touch.pageX;
        this.deltaY = 0;
        this.startY = touch.pageY;
        this.lastY = touch.pageY;
        this.isSwiping = undefined;
    },
    handleTouchMove: function handleTouchMove(event) {
        var _props = this.props;
        var distanceToRefresh = _props.distanceToRefresh;
        var resistance = _props.resistance;

        var touch = event.touches[0];
        // This is a one time test
        if (this.isSwiping === undefined) {
            this.isSwiping = Math.abs(this.startX - touch.pageX) > Math.abs(this.startY - touch.pageY);
        }
        if (this.isSwiping) {
            return;
        }
        //not allow scroll up
        if (touch.pageY < this.startY) {
            return;
        }
        // Prevent native scrolling
        event.preventDefault();
        this.deltaY = this.deltaY + (touch.pageY - this.lastY) * resistance;
        this.lastY = touch.pageY;
        this.setState({
            isDragging: true,
            refreshable: this.deltaY > distanceToRefresh
        });
    },
    handleTouchEnd: function handleTouchEnd() {
        if (this.isSwiping) {
            return;
        }
        var distanceToRefresh = this.props.distanceToRefresh;
        // Quick movement

        if (Math.abs(this.deltaY) > distanceToRefresh) {
            this.setState({
                loading: true
            });
            this.handleRefresh();
        }
        this.setState({
            isDragging: false
        });
    },
    renderHeader: function renderHeader(interpolatedStyle) {
        var _state = this.state;
        var refreshable = _state.refreshable;
        var isDragging = _state.isDragging;
        var loading = _state.loading;

        var translate = interpolatedStyle.translate > 50 ? interpolatedStyle.translate - 50 : 0;
        return _react2.default.createElement(
            'div',
            { className: 'sq-ptr-header',
                style: Object.assign({
                    WebkitTransform: 'translate3d(0,' + translate + 'px,0)',
                    transform: 'translate3d(0,' + translate + 'px,0)'
                }) },
            _react2.default.createElement(
                'span',
                null,
                loading ? '加载中' : refreshable ? '松开刷新' : isDragging ? '下拉刷新' : ''
            )
        );
    },
    renderContent: function renderContent(interpolatedStyle) {
        var translate = interpolatedStyle.translate;
        var children = this.props.children;

        return _react2.default.createElement(
            'div',
            { className: 'sq-ptr-content',
                style: Object.assign({
                    WebkitTransform: 'translate3d(0,' + translate + 'px,0)',
                    transform: 'translate3d(0,' + translate + 'px,0)'
                }) },
            children
        );
    },
    render: function render() {
        var _this = this;

        var _state2 = this.state;
        var isDragging = _state2.isDragging;
        var loading = _state2.loading;

        var translate = this.deltaY || 0;
        var motionStyle = isDragging ? {
            translate: translate
        } : loading ? {
            translate: (0, _reactMotion.spring)(50, {
                stiffness: 300,
                damping: 30
            })
        } : {
            translate: (0, _reactMotion.spring)(0, {
                stiffness: 300,
                damping: 30
            })
        };
        var touchEvents = {
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,
            onTouchEnd: this.handleTouchEnd
        };
        var props = (0, _blacklist2.default)(this.props, 'distanceToRefresh', 'resistance', 'onRefresh');
        return _react2.default.createElement(
            'div',
            _extends({ className: 'sq-ptr' }, props, touchEvents),
            _react2.default.createElement(
                _reactMotion.Motion,
                { style: motionStyle },
                function (interpolatedStyle) {
                    return _this.renderHeader(interpolatedStyle);
                }
            ),
            _react2.default.createElement(
                _reactMotion.Motion,
                { style: motionStyle },
                function (interpolatedStyle) {
                    return _this.renderContent(interpolatedStyle);
                }
            )
        );
    }
});

exports.default = PullToRefresh;
module.exports = exports['default'];
