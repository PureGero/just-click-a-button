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
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Loading...');

  const getCounter = () => firebase.firestore().collection('counts').doc('counter');

  useEffect(() => {
    console.log(`Subscribing to ${getCounter().path}`);

    const unsubscribeCounter = getCounter().onSnapshot(doc => {
      const data = doc.data();
      setMessage('');
      if (!data) {
        getCounter().set({});
      } else {
        setCount(data.value);
      }
    }, error => {
      console.error(error);
      if (error.code === 'resource-exhausted') {
        setMessage('Today\'s clicking limit has been reached, come back tomorrow!');
      } else {
        setMessage(error.message);
      }
    });

    return unsubscribeCounter;
  }, []);

  const increment = async () => {
    try {
      await getCounter().update({
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
