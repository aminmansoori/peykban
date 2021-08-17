import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TrackDetailScreen from './src/screens/TrackDetailScreen';
import TrackCreateScreen from './src/screens/TrackCreateScreen';
import CustomBottomTabBar from './src/components/BottomTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TrackListScreen from './src/screens/TrackListScreen';
import ForgetPassScreen from './src/screens//ForgetPass';
import AccountScreen from './src/screens/AccountScreen';
import SignupScreen from './src/screens/SignupScreen';
import SigninScreen from './src/screens/SigninScreen';
import { createStore, applyMiddleware } from 'redux';
import { useSelector, Provider } from 'react-redux';
import SplashScreen from './src/components/Splash';
import LogsList from './src/components/LogsList';
import { Icon } from 'react-native-elements';
import reducers from './src/reducers';
import ReduxThunk from 'redux-thunk';

const LoginFlowStack = createStackNavigator();
function LoginFlowStackScreen() {
  return (
    <LoginFlowStack.Navigator>
      <LoginFlowStack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
      <LoginFlowStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <LoginFlowStack.Screen name="ForgetPass" component={ForgetPassScreen} options={{ headerShown: false }} />
    </LoginFlowStack.Navigator>
  );
}

const AccountStack = createStackNavigator();
function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerBackImage: () => <Icon name="chevron-left" />,
      }}
    >
      <AccountStack.Screen name="Account" component={AccountScreen}
        options={{ headerShown: false, headerTitleStyle: { fontFamily: "Vazir-FD" } }} />
      <AccountStack.Screen name="LogsList" component={LogsList}
        options={{
          title: 'لاگ‌ها',
          // headerStyle: { height: hp('7.5%') },
          headerTitleStyle: { fontFamily: "Vazir-FD" }
        }} />
    </AccountStack.Navigator>
  );
}


const TrackListFlowStack = createStackNavigator();
function TrackListFlowStackScreen() {
  return (
    <TrackListFlowStack.Navigator
      screenOptions={{
        headerBackImage: () => <Icon name="chevron-left" />,
      }}
    >
      <TrackListFlowStack.Screen
        name="TrackList"
        component={TrackListScreen}
        options={{
          title: "لیست سفرها",
          // headerStyle: { height: hp('7.5%') },
          headerTitleStyle: { fontFamily: "Vazir-FD" }
        }}
      />
      <TrackListFlowStack.Screen
        name="TrackDetail"
        component={TrackDetailScreen}
        options={({ route }) => ({
          title: route.params.name,
          // headerStyle: { height: hp('7.5%') },
          headerBackTitleVisible: false,
          headerTitleStyle: { fontFamily: "Vazir-FD" },
          headerTitleAlign: "center"
        })}
      />
    </TrackListFlowStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function TabScreens() {
  return (
    <Tab.Navigator initialRouteName="TrackCreate"
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "TrackList") {
            iconName = "list";
            color = focused ? "black" : color;
          } else
            if (route.name === "TrackCreate") {
              iconName = "add";
              color = focused ? "black" : color;
            } else
              if (route.name === "Account") {
                iconName = "settings";
                color = focused ? "black" : color;
              }
          return <Icon name={iconName} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        labelStyle: { fontFamily: "Vazir-FD" },
        keyboardHidesTabBar: true,
        labelPosition: 'below-icon',
        // style: { height: hp('7%') }
      }}
    >
      <Tab.Screen
        name="TrackList"
        options={{ title: "لیست سفرها" }}
        component={TrackListFlowStackScreen} />
      <Tab.Screen
        name="TrackCreate"
        options={{ title: "ثبت سفر جدید" }}
        component={TrackCreateScreen} />
      <Tab.Screen
        name="Account"
        options={{ title: "حساب کاربری" }}
        component={AccountStackScreen} />
    </Tab.Navigator >
  );
}

const Stack = createStackNavigator();

function MyStack() {
  const userToken = useSelector(State => State.userTokenReducer);
  const isLoading = useSelector(State => State.isLoadingReducer);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {userToken === null ? (
        <Stack.Screen name="loginFlow" component={LoginFlowStackScreen} options={{ headerShown: false }} />
      ) : (
          <Stack.Screen name="TabScreens" component={TabScreens} options={{ headerShown: false }} />
        )}
    </Stack.Navigator>
  );
}

export default function App() {

  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

  return (
    <NavigationContainer>
      <Provider store={store}>
        <MyStack />
      </Provider>
    </NavigationContainer>
  );
}