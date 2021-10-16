import React from 'react';
import styled from 'styled-components';
import firebase from 'firebase';

const Button = styled.button`
  margin: 20px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
`;

const Warning = styled.div`
  color: #ff7777;
`;

interface ClickButtonProps {
  
}

interface ClickButtonState {
  count: number;
  message: string;
}

class ClickButton extends React.Component<ClickButtonProps, ClickButtonState> {
  db = firebase.firestore();
  counter = this.db.collection('counts').doc('counter');
  unsubscribeCounter?: () => void;

  state = {
    count: 0,
    message: 'Loading...'
  };

  async componentDidMount() {
    this.unsubscribeCounter = this.counter.onSnapshot(doc => {
      const data = doc.data();
      this.setMessage('');
      if (!data) {
        this.counter.set({});
      } else {
        this.setCount(data.value);
      }
    });

    try {
      await this.counter.get();
    } catch (e) {
      this.setMessage('Today\'s clicking limit has been reached, come back tomorrow!')
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeCounter) {
      this.unsubscribeCounter();
    }
  }

  setCount(value: number) {
    this.setState(state => ({
      count: value
    }));
  }

  setMessage(value: string) {
    this.setState(state => ({
      message: value
    }));
  }

  render() {  
    return (
      <div>
        <Button onClick={() => this.increment()}>
          {this.state.message ? this.state.message : `Clicks: ${this.state.count}`}
        </Button>
        <Warning>
          Limited to 20,000 clicks per day
        </Warning>
      </div>
    );
  }

  async increment() {
    try {
      await this.counter.update({
        value: firebase.firestore.FieldValue.increment(1)
      });
    } catch (e) {
      this.setMessage('Today\'s clicking limit has been reached, come back tomorrow!')
    }
  };

}

export default ClickButton;
