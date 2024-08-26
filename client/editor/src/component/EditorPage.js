import React, { useEffect, useRef, useState } from 'react';
import Client from './Client';
import Editor from './Editor';


import { initSocket } from "../Socket";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from 'react-hot-toast';

function EditorPage() {
  const [clients, setClient] = useState([]);
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
// useParams() use to access the IRL (roomId) link
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Socket Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit('join', {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        // this ensures that the new user connected message does not display to that user itself
        if (username !== Location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClient(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        });
      });

      // listening for disconnected
      socketRef.current.on('disconnected', ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    // cleanup
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      toast.error("Unable to Copy Room Id");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100 no-gutters'>
        
        {/* Sidebar */}
        <div className='col-md-2 text-light d-flex flex-column h-100' 
     style={{backgroundColor: '#6d0019', overflow: 'hidden'}}
>
  <img 
    className='img-fluid mx-auto' 
    src='/images/Home Page Logo.png' 
    alt='CollabChat' 
    style={{filter: 'invert(1)', marginTop: '12px'}}
  />
  <hr style={{marginTop: '-5px'}}/>
  
  {/* Client list container */}
  <div className='d-flex flex-column flex-grow-1' style={{overflowY: 'auto'}}>
    {clients.map((client) => (
      <Client key={client.socketId} username={client.username}/>
    ))}
  </div>
  
  {/* Buttons */}
  <div className='mt-auto'>
    <hr/>
    <button className='btn btn-success' onClick={copyRoomId}>Copy Room ID</button>
    <button className='btn btn-danger mt-2 mb-3 px-3 btn-block' onClick={leaveRoom}>
      Leave Room
    </button>
  </div>
</div>

        {/* Main Content Area (Editor) */}
        <div className='col-md-10 d-flex flex-column h-100' 
     style={{ backgroundColor: '#fff', overflow: 'hidden', position: 'relative' }}>
  <div style={{
    flex: 1,
    overflowY: 'auto',
    paddingRight: 0,
    paddingLeft: 0,
    marginRight: 0,
    width: '100%', // Adjust to prevent content from hiding behind the hidden scrollbar
    scrollbarWidth: 'none',  // Firefox
    msOverflowStyle: 'none'  // IE and Edge
  }}>
     <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code}/>
  </div>
</div>

      </div>
    </div>
  );
  
}

export default EditorPage;
