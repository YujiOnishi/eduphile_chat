import React, { Component } from 'react';
import { firestore, firebaseApp } from '../plugins/firebase';

export default class List extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      words: [],
      documents: [],
      isLoading: true,
      word: "",
      uid: ""
    };
    this.getWords = this.getWords.bind(this);
    this.addWord = this.addWord.bind(this);
    this.changeWord = this.changeWord.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.getWords(true);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getWords(isPost) {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        firestore.collection('room')
          .orderBy('created_at')
          .get()
          .then(snapShot => {
            let dicWords = [];
            snapShot.forEach(doc => {
              var userName;
              var _timestamp = doc.data().created_at
              var _d = _timestamp ? new Date(_timestamp * 1000) : new Date();
              var m = ("0" + (_d.getMonth() + 1)).slice(-2);
              var d = ("0" + _d.getDate()).slice(-2);
              var H = ("0" + _d.getHours()).slice(-2);
              var i = ("0" + _d.getMinutes()).slice(-2);
              var s = ("0" + _d.getSeconds()).slice(-2);
              var time = `${m}/${d} ${H}:${i}:${s}`;

              firestore.collection("user").doc(doc.data().uid).get()
                .then(docData => {
                  if (!docData.exists) {
                    userName = "No such name!";
                  } else {
                    userName = docData.data().name;
                    dicWords.push({
                      uid: doc.data().uid,
                      word: doc.data().word,
                      date: time,
                      id: doc.id,
                      name: userName
                    });
                    if (this._isMounted) {
                      this.setState({
                        words: dicWords,
                        isLoading: false
                      });
                    }
                  }
                })
                .catch(err => {
                  userName = 'Error getting document' + err;
                });
            });
          });
      }
    });

    if (isPost) {
      setTimeout(() => {
        this.getWords(true);
      }, 100000);
    }
  }

  addWord() {
    if (this.state["word"] === '') {
      return
    }
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        firestore.collection('room').add({
          created_at: new Date(),
          word: this.state.word,
          uid: user.uid,
        }).then(() => {
          this.setState({ word: "" });
          this.getWords(false);
        });
      }
    });
  }

  changeWord(event) {
    this.setState({ word: event.target.value });
  }

  render() {
    return (
      <div>
        {this.state.isLoading &&
          <div className="siimple-card-title siimple--color-white">Loading...</div>}
        {
          this.state.words.map(function (dicWord) {
            return (
              <div className="siimple-card" key={dicWord.id}>
                <div className="siimple-card-title siimple--color-white">{dicWord.word}</div>
                <div className="siimple-card-subtitle siimple--color-white">{dicWord.name}:{dicWord.date}</div>
              </div>
            );
          })
        }
        <form>
          <div className="siimple-field">
            <textarea name="word" type="text" className="siimple-textarea siimple-textarea--fluid" rows="5" onChange={this.changeWord} value={this.state.word} />
          </div>
          <div value="Add" className="siimple-btn siimple-btn--orange l siimple-btn--fluid siimple--text-bold" onClick={() => this.addWord()}>Post</div>
        </form>
      </div>
    );
  }
}