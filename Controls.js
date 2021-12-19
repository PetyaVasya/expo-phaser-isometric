import Expo from 'expo';
import React from 'react';
import { MultiTouchView } from 'expo-multi-touch';
import { View, TouchableWithoutFeedback } from 'react-native';
import AwesomeAlert from "react-native-awesome-alerts";
import { GLView } from 'expo-gl';
import Game from './Game';
import API from './states/Api';


export default class Controls extends React.Component {

    constructor(props) {
      super(props);
      this.state = { showAlert: false, message: `` };
      const apiUrl = "https://ict-hack.azurewebsites.net/api/Game/";
      this.api = new API( { apiUrl } );
      this.isMoving = false;
    };

    showAlert = (msg) => {
        this.game.expoGame.canvas.style.zIndex = -1;
       this.setState(prevState => ({
         showAlert: true,
         message: msg
     }));
     };

     hideAlert = () => {
         this.game.expoGame.canvas.style.zIndex = 10000;
      this.setState({
        showAlert: false
      });
    };

  componentDidMount() {
    this._subscribe();
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  hange = (event) => {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      this.onTouchesMoved({pageX: event.pageX, pageY: event.pageY});
  }

  _subscribe = () => {
      document.onmousemove = this.hange;

    let was = false;
    let waiter = setInterval(() => {
        if (was) {
            return;
        }
    console.log(this.game.expoGame.canvas);
        if (this.game.expoGame.canvas != null) {
            was = true;
            clearInterval(waiter);
            this.game.expoGame.canvas.addEventListener("click", this.onClick, !1);
            this.game.expoGame.canvas.style.zIndex = 100;
        }

    }, 250);

  };

  _unsubscribe = () => {
    // Expo.Accelerometer.removeAllListeners();
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  onTouchesBegan = ({ pageX: x, pageY: y }) => {
    this.game && this.game.onTouchesBegan(x, y);
}
    onClick = ({ pageX: x, pageY: y}) => {
        if (this.isMoving) return;
        this.canMove(() => {
            this.isMoving = true;
            this.game && this.game.onClick(x, y, (ended) => {
                console.log(ended);
                if (!ended) {
                    this.isMoving = false;
                    return;
                }
                this.getPrize((res) => {
                    this.isMoving = false;
                    this.showAlert(res.message);
                })
            });
        });

    }
    canMove = can => {
        this.api.canMove().then((res) => {
            if (res) {
                can(res);
            } else {
                this.showAlert("Вы не можете ходит :()");
            }
        });
    }
    getPrize = callback => {
        this.api.getPrize().then((res) => {
            if (res) {
                callback(res);
            } else {
                this.showAlert("Кажется, Вы уже сходили :()");
            }
        });
    }


  onTouchesMoved = ({ pageX: x, pageY: y }) =>
    this.game && this.game.onTouchesMoved(x, y);
  onTouchesEnded = ({ pageX: x, pageY: y }) =>
    this.game && this.game.onTouchesEnded(x, y);
  render() {
      const {showAlert, message} = this.state;

    return (
        <View>
            <View style={{flex: 1, position: 'absolute', width: '100vw', height: '100vh', zIndex: 100}}>
            <AwesomeAlert
              style={{flex: 1}}
              show={showAlert}
              message={message}
              closeOnTouchOutside={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="Ясненько"
              confirmText="Понятненько"
              onCancelPressed={() => {
                  this.hideAlert();
                }}
                onConfirmPressed={() => {
                  this.hideAlert();
                }}
            />
            </View>
        <GLView
          style={{ flex: 1}}
          onContextCreate={this._onContextCreate}
        />

        </View>
      // </MultiTouchView>
    );
  }
  _onContextCreate = context => {
      console.log("asdasdas");
      const { innerWidth: width, innerHeight: height } = window,
      seed = this.api.seed;
      this.game = new Game({ context, width, height, seed });
      this._subscribe();
  }
}
