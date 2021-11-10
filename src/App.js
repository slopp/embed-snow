import './App.css';
import {DashboardEmbed} from './components/DashboardEmbed'

function App() {
  return (
  <div>
    <h1>"The Snow Report"</h1>
    <div id="dashboard">
        <DashboardEmbed />
    </div>
    <a href="https://github.com/slopp/embed-snow">Information on Data Pipeline, Architecture, and Source Code</a>
  </div>
   
  );
}

export default App;
