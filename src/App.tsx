import React, { Suspense, lazy, useState, useTransition } from "react";
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
  ToggleButton,
  Item,
  TabList,
  TabPanels,
  Tabs,
  NumberField,
  Flex,
  Grid,
  View,
  Text,
} from "@adobe/react-spectrum";

import { SuspenseListExample } from "./SuspenseListExample";
import { User, UserScheduled, resource } from "./UserList";

// TODO: use useTransition to show how to load the data but only switch to the next tab once the data is loaded

function App() {
  const [isPaused, setPaused] = React.useState(false);
  const [hasDelay, setHasDelay] = React.useState(false);
  const [delay, setDelay] = React.useState(0);
  const [isPending, startTransition] = useTransition({ timeoutMs: 2000 }); // returned value order differs from docs
  const [selectedKey, setSelectedKey] = React.useState("LPC");
  const [userResource, setUserResource] = React.useState(resource.data("abc"));

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

  const toggleDelay = (_: boolean) => {
    setHasDelay(!hasDelay);
  };

  const onSelectionChange = (key: React.Key) => {
    if (key === "UTE") {
      startTransition(() => {
        const nextUser = resource.data("def");
        setUserResource(nextUser);
        defer(
          1, // priority
          () => {
            setSelectedKey(key);
          },
          { delay: delay }
        );
      });
    } else {
      setSelectedKey(key as string);
    }
  };

  return (
    <Suspense fallback={<p>Application fallback...</p>}>
      <Provider theme={defaultTheme}>
        <Grid
          areas={["sidebar content"]}
          columns={["1fr", "3fr"]}
          rows={["size-1000", "auto", "size-1000"]}
          height="size-6000"
          gap="size-100"
        >
          <View gridArea="sidebar" padding="size-250">
            <Flex direction="column" gap="size-100">
              <Button variant="cta" onPress={togglePause} width="size-1000">
                {isPaused ? "Resume" : "Pause"} Execution
              </Button>
              <Flex direction="row" gap="size-100" alignItems="center">
                <Text>Delay</Text>
                <ToggleButton
                  onChange={toggleDelay}
                  flexGrow={0}
                  isSelected={hasDelay}
                  isEmphasized={hasDelay}
                >
                  {hasDelay ? "ON" : "OFF"}
                </ToggleButton>
                <NumberField
                  defaultValue={1}
                  minValue={1}
                  onChange={setDelay}
                  flexGrow={3}
                />
              </Flex>
            </Flex>
          </View>
          <View gridArea="content">
            <Suspense fallback={<p>Loading...</p>}>
              <Tabs
                onSelectionChange={onSelectionChange}
                selectedKey={selectedKey}
              >
                <TabList>
                  <Item key="LPC">Loader Per Component</Item>
                  <Item key="SL">Single Loader</Item>
                  <Item key="SLAE">Suspense List API Example</Item>
                  <Item key="UTE">useTransition example</Item>
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
                  <Item key="UTE">
                    {isPending ? <p>Pending request...</p> : null}
                    <Suspense fallback={<p>useTransition fallback...</p>}>
                      <UserScheduled id={"def"} _resource={userResource} />
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
    </Suspense>
  );
}

export default App;
