import Initialize from '@/components/initialize';
import NavigationConfig from '@/components/NavigationConfig';
import store from '@/store';
import { StatusBar, Text, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
 
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const handleNavigationStateChange = (state: any) => {
    console.log("导航状态变化", state)
  }

  return (
    <Provider store={store}>
      <Initialize />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaProvider>
        <NavigationConfig onStateChange={handleNavigationStateChange}/>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
