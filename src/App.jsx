import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css';
import {AnswersList, Chats} from './components/index'
import FormDialog from './components/Forms/FromDialog';
import {db} from './firebase/index'

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState('init');
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  // モーダルを開く
  const handleClickOpen = () => {
      setOpen(true);
  };

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);


  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    // chatsに配列を入れてる
    addChats({
      text: nextDataset.question,
      type: 'question'
    })
    setAnswers(nextDataset.answers)
    setCurrentId(nextQuestionId)
  }

  const addChats = (chat) => {
    setChats(prevChats => {
      return [...prevChats, chat]
    })
  }

  // 選択したanswerで更新
  const selectAnswer = (selectedAnswer,nextQuestionId,) => {
    switch(true) {
      case (/^https:*/.test(nextQuestionId)):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank';
        a.click();
        break;

      case (nextQuestionId === "contact"):
        handleClickOpen();
        break;

      default:
        addChats({
          text: selectedAnswer,
          type: 'answer'
        });
        setTimeout(() => {
          displayNextQuestion(nextQuestionId, dataset[nextQuestionId])
        }, 500); 
        break;
    }
  }

  // 最初だけ行う処理
  useEffect(() => {
    (async() => {
      const initDataset = [];

      await db.collection("questions").get().then(snapshots => {
        snapshots.forEach(doc => {
          const id = doc.id;
          const data = doc.data();
          initDataset[id] = data
        })
      })

      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })()
  }, [])

  // render毎に行う処理
  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if(scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  })

  return (
    <section className='c-section'>
      <div className='c-box'>
        <Chats chats={chats}/>
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog  open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App
