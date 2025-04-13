
import './App.css';
import Login from './component/Login';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import SignUp from './component/SignUp';
import Chat from './component/Chat';
import StudyPlanner from './component/StudyPlanner';
import Start from './component/Start';
import ContentSuggestion from './component/ContentSuggestion';
function App() {
  return (
   <>
   <Router>
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/chat' element={<Chat/>}></Route>

      <Route path='/studyplanner' element={<StudyPlanner/>}></Route>
      <Route path='/content' element={<ContentSuggestion/>}></Route>
      <Route path='/' element={<Start/>}></Route>
      </Routes>
      </Router>
     
   </>
  );
}

export default App;
