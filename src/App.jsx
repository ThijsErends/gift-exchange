import { NamePicker } from './components/NamePicker/NamePicker';
import { SlotMachine } from './components/NamePicker/SlotMachine';
import { Snow } from './components/Snow/Snow';
import './App.css';

function App() {
  return (
    <div className="app">
      <Snow count={60} />
      <header className="header">
        <h1>Gift Exchange.</h1>
      </header>

      <main className="main">
        <NamePicker AnimationComponent={SlotMachine} />
      </main>
    </div>
  );
}

export default App;
