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
}

class ClickButton extends React.Component<ClickButtonProps, ClickButtonState> {
  db = firebase.firestore();
  counter = this.db.collection('counts').doc('counter');
  unsubscribeCounter?: () => void;

  state = {
    count: 0,
  };

  componentDidMount() {
    this.unsubscribeCounter = this.counter.onSnapshot(doc => {
      const data = doc.data();
      if (!data) {
        this.counter.set({});
      } else {
        this.setState(state => ({
          count: data.value
        }));
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeCounter) {
      this.unsubscribeCounter();
    }
  }

  render() {  
    return (
      <div>
        <Button onClick={() => this.increment()}>
          Clicks: {this.state.count}
        </Button>
        <Warning>
          Limited to 20,000 clicks per day
        </Warning>
      </div>
    );
  }

  async increment() {
    await this.counter.update({
      value: firebase.firestore.FieldValue.increment(1)
    });
  };

}

export default ClickButton;
