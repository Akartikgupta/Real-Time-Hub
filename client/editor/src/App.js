import './App.css';
import Home from './component/Home';
import {Routes, Route} from 'react-router-dom';
import EditorPage from './component/EditorPage';
import { Toaster } from 'react-hot-toast';
// import Test from './component/test';

function App() {
  return (
    <>
      <div>
        <Toaster  position='top-center'></Toaster>
      </div>
      <Routes>
        {/* Trigger the Home page */}
        <Route path = '/' element = {<Home/>}/>
        {/* Trigger editor */}
        <Route path = '/editor/:roomId' element = {<EditorPage/>}/>
      </Routes>
    </>
  );
}

export default App;
