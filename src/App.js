import './App.css';
import {DashboardEmbed} from './components/DashboardEmbed'

function App() {
  return (
  <div>
    <h1>"The Snow Report"</h1>
    <div id="dashboard">
        <DashboardEmbed />
    </div>
    <img src="https://storage.googleapis.com/snow-data-artifacts/SnoCountry.png"/>
  </div>
   
  );
}

export default App;
