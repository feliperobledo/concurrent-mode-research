import React, { Suspense, lazy, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  unstable_scheduleCallback as defer,
  unstable_pauseExecution as pause,
} from "scheduler";

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
import { User, UserScheduled } from "./UserList";

function App() {
  const [currentKey, setCurrentKey] = React.useState("FoR");

  const selectTab = (selection: number | string) => {
    if (typeof selection === "string") {
      const options = {
        delay: 0,
        timeout: 1000,
      };

      if ((window as any).useExperimental) {
        pause();
        defer(
          (window as any).priority,
          () => {
            setCurrentKey(selection);
          },
          options
        );
      } else {
        setCurrentKey(selection);
      }
    }
  };

  return (
    <Provider theme={defaultTheme}>
      <Suspense fallback={<p>Loading...</p>}>
        <Tabs
          aria-label="History of Ancient Rome"
          onSelectionChange={selectTab}
          selectedKey={currentKey}
        >
          <TabList>
            <Item key="LPC">Loader Per Component</Item>
            <Item key="SL">Single Loader</Item>
            <Item key="SLAE">Suspense List API Example</Item>
          </TabList>
          <TabPanels>
            <Item key="LPC">
              <User />
              <User />
              <User />
            </Item>
            <Item key="SL">
              <Suspense fallback={<p>Single loader...</p>}>
                <UserScheduled id={"123"} />
                <UserScheduled id={"456"} />
                <UserScheduled id={"789"} />
              </Suspense>
            </Item>
            <Item key="SLAE">
              <SuspenseListExample />
            </Item>
          </TabPanels>
        </Tabs>
      </Suspense>
    </Provider>
  );
}

export default App;
