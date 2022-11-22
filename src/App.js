import React, { useState, useEffect } from "react";
import './App.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import firebase from "firebase";
import 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDD6ufefMpOkC3cXQ8hYCfQvZxoRzTOJCI",
  authDomain: "fir-dc2c4.firebaseapp.com",
  projectId: "fir-dc2c4",
  storageBucket: "fir-dc2c4.appspot.com",
  messagingSenderId: "640363068731",
  appId: "1:640363068731:web:781df81c225f0c3c178b1e"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()



function App() {

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const[islaod,setIsload]=useState(false)
  const [upd, setUpd] = useState()
 console.log('data==>',data)
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {

    try {
      const res = await db.collection('TODO').orderBy('createdat', 'asc').get()
      const convertedData = res.docs.map(el => ({ ...el.data(), id: el.id }))
      setData([...convertedData])
    } catch (err) {
         console.log(err)
    }

  }


  const addTodo = async () => {

    try {
      const newTodo = {
        text,
        createdat: Date.now()
      };
      console.log('adding')
      setIsload(true)
      await db.collection('TODO').add(newTodo)
      console.log('added')
      setIsload(false)
      getData()
      setText('')

    } catch (err) {
      console.log('add wala error', err)
      setIsload(false)
    }

  }





  //////delet//////////

  const deletTodo =async (id) => {
try {

console.log('deleting')
setIsload(true)
await db.collection('TODO').doc(id).delete()
setIsload(false)
getData()
setText('')
console.log('deleted')
} catch (err) {
  console.log('Delet==>',err)
  setIsload(false)
}
  }

  ///////upd check/////////


  const upd_check = (val) => {
    setUpd(val)
    setText(val.text)
  }

  //////////handleupdate\\\\\\\\\\

  const handleUpdate = async() => {
    
    try {
      const newTodo = {
        text,
        createdat: Date.now()
      };
      console.log('updating')
      setIsload(true)
      await db.collection('TODO').doc(upd.id).update(newTodo)
      console.log('updated')
      setIsload(false)
      setUpd()
      getData()
      setText('')

    } catch (err) {
      setIsload(false)
      console.log('add wala error', err)
    }
     
  }





  return (

    <div className="App">
      <h1> My Todo</h1>
      {islaod&&<p>loading...</p>}
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      {!!upd ? <button onClick={handleUpdate}>update now</button> : <button onClick={addTodo}>Add</button>}

      <ul>{data.map(val => <div key={val.id}>
        <span>{val.text}</span>
        <button onClick={() => deletTodo(val.id)}>dlt</button>
        <button onClick={() => upd_check(val)}>upd</button>
      </div>)}</ul>

    </div>
  )
};



export default App;