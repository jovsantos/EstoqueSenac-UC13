
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";    

import HomeScreen from "../screens/HomeScreen";
import CadastroProdutoScreen from "../screens/CadastroProdutoScreen";
import SplashScreen from "../screens/SplashScreen";
import MovimentacaoScreen from "../screens/MovimentacaoScreen";
import HistoricoScreen from "../screens/HistoricoScreen";


const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2d62d3f5",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#F4F6F5",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "EstoqueSenac",
          }}
        />

        <Stack.Screen
          name="CadastroProduto"
          component={CadastroProdutoScreen}
          options={{
            title: "Cadastro de produto",
          }}
        />
        
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Movimentacao"
          component={MovimentacaoScreen}
          options={{
            title: "Movimentação de produto",
          }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{
            title: "Histórico de movimentações",
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
