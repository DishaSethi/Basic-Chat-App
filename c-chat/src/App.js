import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Join from "./component/Join/Join";
import Chat from "./component/Chat/Chat";
// import socketIO from "socket.io-client";


function App() {


  return (
    <Router>
      <Routes>
        {/* Use `element` instead of `component` */}
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
