import React, { Suspense, lazy, useState } from "react";
import {
  unstable_scheduleCallback as defer,
  unstable_pauseExecution as pause,
  unstable_continueExecution as resume,
} from "scheduler";
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
  NumberField,
  Flex,
  Grid,
  View,
} from "@adobe/react-spectrum";

import { SuspenseListExample } from "./SuspenseListExample";
import { User, UserScheduled, resource } from "./UserList";

function App() {
  const [isPaused, setPaused] = React.useState(false);
  const [hasDelay, setHasDelay] = React.useState(false);
  const [delay, setDelay] = React.useState(0);

  const togglePause = () => {
    if ((window as any).useExperimental) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
      setPaused(!isPaused);
    }
  };

  const toggleDelay = () => {
    setHasDelay(!hasDelay);
  };

  return (
    <Provider theme={defaultTheme}>
      <Grid
        areas={["sidebar content"]}
        columns={["1fr", "3fr"]}
        rows={["size-1000", "auto", "size-1000"]}
        height="size-6000"
        gap="size-100"
      >
        <View gridArea="sidebar">
          <Flex direction="column" width="size-1000">
            <Button variant="cta" onPress={togglePause}>
              {isPaused ? "Resume" : "Pause"} Execution
            </Button>
            <Flex direction="row" width="size-2000" gap="size-100">
              <Button variant="cta" onPress={togglePause}>
                Delay {hasDelay ? "ON" : "OFF"}
              </Button>
              <NumberField
                label="Delay"
                defaultValue={1}
                minValue={1}
                onChange={setDelay}
              />
            </Flex>
          </Flex>
        </View>
        <View gridArea="content">
          <Suspense fallback={<p>Loading...</p>}>
            <Tabs aria-label="History of Ancient Rome">
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
        </View>
      </Grid>
    </Provider>
  );
}

export default App;
