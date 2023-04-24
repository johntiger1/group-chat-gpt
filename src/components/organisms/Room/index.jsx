import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import db from "../../../firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useStateValue } from "../../../store/StateProvider";
import RoomHeader from "./RoomHeader";
import RoomBody from "./RoomBody";
import RoomInput from "./RoomInput";
import callGPT35Turbo from "./openAIHelper.jsx";

export default function Room() {
  const [seed, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const { roomId } = useParams([]);
  const timeSource = (message) => message.timestamp?.toDate();
  const [gptMessage, setGPTMessage] = useState({});
  const [isLoaded, setLoaded] = useState(false);

  const showDate = (message) => {
    if (moment(timeSource(message)).fromNow() > moment().calendar()) {
      return moment(timeSource(message)).fromNow();
    }
    return moment(timeSource(message)).calendar();
  };

  const getRoomById = db.collection("rooms").doc(roomId);

  const getRooms = async (isMounted) =>
    getRoomById.onSnapshot((snapshot) => {
      if (isMounted) return setRoomName(snapshot.data().name);
      return null;
    });

  const baseInput = [
      {role: "system", content: "You are groupChatGPT. It is like Regular ChatGPT but now you are embedded in a chat room with multiple users. Any message you receive from users will have their name at the start of it. In your replies, do not do the same."}
  ]

  const handleClick = async () => {
    var finalInput = baseInput;
    console.log(messages);
    console.log(messages[0]);
    console.log(messages.length);
    for (let i = 0; i < messages.length; i++) {
        finalInput.push({role: messages[i].role, content: messages[i].name + ": " + messages[i].message});
    };
    console.log(finalInput);
     try {
        const response = await callGPT35Turbo(finalInput);
        setGPTMessage(response);
        setLoaded(true);
     } catch (err) {
       console.log(err.message);
     }
  }

  useEffect(() => {
    if (isLoaded) {
        const message = gptMessage.data.choices[0].message.content;
        db.collection("rooms")
          .doc(roomId)
          .collection("messages")
          .add({
              message: message,
              name: 'groupChatGPT',
              uid: 'groupChatGPT',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              role: "system"
          }).catch((err) => console.error("Error writing chatbot: ", err));
        setLoaded(false);
    }
  }, [gptMessage])

  const getMessages = async (isMounted) =>
    getRoomById
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        if (isMounted) setMessages(snapshot.docs.map((doc) => doc.data()));
      });

  useEffect(() => {
    let isMounted = true;

    if (user && roomId) {
      getRooms(isMounted).then(() => {
        setSeed(Math.floor(Math.random() * 5000));
        getMessages(isMounted);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  return (
    <div className="room">
      <button onClick={handleClick}>Send responses to GPT</button>
      <RoomHeader
        db={db}
        user={user}
        seed={seed}
        messages={messages}
        roomName={roomName}
        roomId={roomId}
        showDate={showDate}
      />

      <RoomBody messages={messages} showDate={showDate} user={user} />

      <RoomInput db={db} roomId={roomId} user={user} />
    </div>
  );
}
