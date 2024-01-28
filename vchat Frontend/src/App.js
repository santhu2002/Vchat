import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Chat from "./Components/Chat";


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/chats">
            <Chat />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
