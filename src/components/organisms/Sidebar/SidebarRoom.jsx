import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import db from "../../../firebase";

const SidebarRoom = ({ id, name }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const getRoom = () =>
    db
      .collection("rooms")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );

  useEffect(() => {
    let isMounted = true;

    if (id) return isMounted && getRoom();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => setSeed(Math.floor(Math.random() * 5000)), []);

  return (
    <div className="sidebar__Room">
      <Link to={`/rooms/${id}`}>
        <div className="sidebar__RoomContainer">
          <Avatar
            src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
            alt="Group Avatar"
          />
          <div className="sidebar__RoomInfo">
            <h2>{name}</h2>
            {messages[0] ? <p>{messages[0]?.message}</p> : <i>Empty room</i>}
          </div>
        </div>
      </Link>
    </div>
  );
};

SidebarRoom.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default SidebarRoom;
