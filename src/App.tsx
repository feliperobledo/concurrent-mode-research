import React, { Suspense, lazy } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  Provider,
  defaultTheme,
  Button,
  Item,
  TabList,
  TabPanels,
  Tabs,
} from "@adobe/react-spectrum";

import { SuspenseListExample } from "./SuspenseListExample";

//const GameProfile = lazy(() => import("./GameProfile"));

function App() {
  return (
    <Provider theme={defaultTheme}>
      <Suspense fallback={<p>Loading...</p>}>
        <Tabs aria-label="History of Ancient Rome">
          <TabList>
            <Item key="FoR">Founding of Rome</Item>
            <Item key="MaR">Monarchy and Republic</Item>
            <Item key="Emp">Empire</Item>
          </TabList>
          <TabPanels>
            <Item key="Emp">
              <SuspenseListExample />
            </Item>
          </TabPanels>
        </Tabs>
      </Suspense>
    </Provider>
  );
}

export default App;
