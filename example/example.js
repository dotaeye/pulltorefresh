import React from 'react';
import ReactDOM from 'react-dom';
import SQPullToRefresh from '../src/sq-pulltorefresh';

var exampleLoadingFunction = function () {
    return new Promise(function (resolve, reject) {
        // Run some async loading code here

        if (true /* if the loading worked */) {
            resolve();
        } else {
            reject();
        }
    });
};

var App = React.createClass({

    getInitialState(){
        return {
            maxCount: 42
        }
    },

    render () {
        var items = [];
        var {maxCount}=this.state;
        for (var i = 0; i < maxCount; i++) items.push(i);
        return (
            <SQPullToRefresh style={{height: 540}}
                             onRefresh={()=>{
                                 return new Promise(( resolve, reject )=>{
                                    if(true) {
                                        setTimeout(()=>{
                                            resolve();
                                            this.setState({
                                                maxCount:Math.ceil(Math.random()*100)
                                            });
                                        },3000)
                                    }else{
                                       reject();
                                    }
                                });
                             }}
                >
                <div>Latest item count {maxCount}</div>
            </SQPullToRefresh>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('example'));
