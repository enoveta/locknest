import {AppRegistry} from 'react-native';
import {createRoot} from 'react-dom/client';
import App from '../App';
import {name as appName} from '../app.json';

AppRegistry.registerComponent(appName, () => App);

const root = document.getElementById('root');

if (!root) {
  throw new Error('LockNest web root element was not found.');
}

createRoot(root).render(AppRegistry.getApplication(appName).element);
