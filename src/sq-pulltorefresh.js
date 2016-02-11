import classnames from 'classnames';
import React, { PropTypes } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import blacklist from 'blacklist';
import {Motion, spring} from 'react-motion';


const PullToRefresh = React.createClass({


    getInitialState(){
        return {
            loading: false,
            refreshable: false
        }
    },

    propTypes: {
        distanceToRefresh: PropTypes.number,
        resistance: PropTypes.number,
        onRefresh: PropTypes.func
    },

    getDefaultProps(){
        return {
            distanceToRefresh: 50,
            resistance: 0.5,
            onRefresh: ()=>new Promise((resolve, reject) => {
            })
        }
    },

    handleRefresh() {
        let loadingPromise = this.props.onRefresh();
        // Once actual loading is complete, reset pull to refresh
        loadingPromise.then(this.onRefreshEnd);
    },

    onRefreshEnd(){
        console.log('onRefreshEnd');
        this.setState({
            loading: false,
            refreshable: false,
        });
    },

    componentDidMount () {

    },

    componentWillUnmount () {

    },

    handleTouchStart(event) {
        const touch = event.touches[0];
        this.startX = touch.pageX;
        this.deltaY = 0;
        this.startY = touch.pageY;
        this.lastY = touch.pageY;
        this.isSwiping = undefined;
    },

    handleTouchMove(event){

        const { distanceToRefresh, resistance }=this.props;

        const touch = event.touches[0];

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

        if (this.deltaY > distanceToRefresh) {
            this.setState({
                isDragging: true,
                refreshable: true,
            });
        } else {
            this.setState({
                isDragging: true,
                refreshable: false,
            });
        }

    },

    handleTouchEnd(){
        if (this.isSwiping) {
            return;
        }
        const { distanceToRefresh }=this.props;

        // Quick movement
        if (Math.abs(this.deltaY) > distanceToRefresh) {
            this.setState({
                    loading: true
                }
            );
            this.handleRefresh();
        }
        this.setState({
            isDragging: false
        });
    },


    renderHeader(interpolatedStyle) {
        const {
            refreshable,
            isDragging,
            loading,
            } = this.state;

        const translate = interpolatedStyle.translate > 50 ? interpolatedStyle.translate - 50 : 0;

        return (
            <div className='sq-ptr-header'
                 style={Object.assign({
          WebkitTransform: `translate3d(0,${translate}px,0)`,
          transform: `translate3d(0,${translate}px,0)`
        })}>
                <span>{loading ? '加载中' : (refreshable ? '松开刷新' : (isDragging ? '下拉刷新' : ''))}</span>
            </div>
        );
    },

    renderContent(interpolatedStyle){

        const translate = interpolatedStyle.translate;
        const {children}=this.props;
        return (
            <div className='sq-ptr-content'
                 style={Object.assign({
          WebkitTransform: `translate3d(0,${translate}px,0)`,
          transform: `translate3d(0,${translate}px,0)`
        })}>
                {children}
            </div>
        );
    },

    render() {
        const {
            isDragging,
            loading,
            } = this.state;

        let translate = this.deltaY || 0;

        const motionStyle = isDragging ? {
            translate: translate
        } : (loading ? {
            translate: spring(50, {
                stiffness: 300,
                damping: 30
            })
        } : {
            translate: spring(0, {
                stiffness: 300,
                damping: 30
            })
        });

        const touchEvents = {
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,
            onTouchEnd: this.handleTouchEnd
        };

        const props = blacklist(this.props, 'distanceToRefresh', 'resistance', 'onRefresh');

        return (
            <div className='sq-ptr' {...props} {...touchEvents}>
                <Motion style={motionStyle}>
                    {interpolatedStyle => this.renderHeader(interpolatedStyle)}
                </Motion>
                <Motion style={motionStyle}>
                    {interpolatedStyle => this.renderContent(interpolatedStyle)}
                </Motion>
            </div>
        );
    }

});


export default PullToRefresh;