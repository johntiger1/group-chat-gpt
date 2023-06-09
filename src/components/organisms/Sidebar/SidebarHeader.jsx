import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Chat as ChatIcon,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import firebase from "firebase/app";
import "firebase/firestore";
import db, { auth } from "../../../firebase";
import { useStateValue } from "../../../store/StateProvider";

export default function SidebarHeader() {
  const [{ user }] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const createRoom = () => {
    const roomName = prompt("Please enter name for chat room");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        datecreated: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const toggleOption = ({ currentTarget }) => setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);

  const clickLogout = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    auth.signOut().then(() => navigate("/"));
  };

  return (
    <div className="sidebar__header">
      <div className="sidebar__headerMenu">
        <div className="sidebar__headerLeft">
          <Link to="/">
            <Avatar src={user?.photoURL} alt="Group Avatar" />
          </Link>
        </div>
        <div className="sidebar__headerRight">
          <IconButton aria-label="new-room" onClick={createRoom}>
            <ChatIcon />
          </IconButton>
          <IconButton
            aria-label="option menu"
            aria-controls="option-menu"
            aria-haspopup="true"
            className="sidebar__option"
            onClick={toggleOption}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="option-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={clickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <InputBase
            inputProps={{ "aria-label": "search bar" }}
            placeholder="Search or start new room"
            type="text"
            sx={{ fontSize: "13px" }}
          />
        </div>
      </div>
    </div>
  );
}
