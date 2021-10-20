import { useEffect, useState } from 'react';
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

const ClickButton = () => {
  const db = firebase.firestore();
  const counter = db.collection('counts').doc('counter');

  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const unsubscribeCounter = counter.onSnapshot(doc => {
      const data = doc.data();
      setMessage('');
      if (!data) {
        counter.set({});
      } else {
        setCount(data.value);
      }
    });

    (async () => {
      try {
        await counter.get();
      } catch (e) {
        setMessage('Today\'s clicking limit has been reached, come back tomorrow!');
      }
    })();

    return unsubscribeCounter;
  });

  const increment = async () => {
    try {
      await counter.update({
        value: firebase.firestore.FieldValue.increment(1)
      });
    } catch (e) {
      setMessage('Today\'s clicking limit has been reached, come back tomorrow!');
    }
  };

  return (
    <div>
      <Button onClick={() => increment()}>
        {message ? message : `Clicks: ${count}`}
      </Button>
      <Warning>
        Limited to 20,000 clicks per day
      </Warning>
    </div>
  );
}

export default ClickButton;
