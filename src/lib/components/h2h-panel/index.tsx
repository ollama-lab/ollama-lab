import { Component, createSignal } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";


const [tabValue, setTabValue] = createSignal("chats");

const H2hPanel: Component = () => {
  return (
    <Tabs class="px-2 py-2 lg:px-4 lg:py-4" value={tabValue()} onChange={setTabValue}>
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="chats">CHats</TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
      </TabsList>

      <TabsContent value="chats">
      </TabsContent>
      <TabsContent value="agents">
      </TabsContent>
    </Tabs>
  );
};

export default H2hPanel;
