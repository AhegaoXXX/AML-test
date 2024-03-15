import { createComponent } from '@lit/react'
import React from 'react'
import './App.css'
import { GraphComponent } from './components/Graph'
import { TreemapComponent } from './components/Treemap'

export const MyGraphComponent = createComponent({
  tagName: 'graph-component',
  elementClass: GraphComponent,
  react: React,
});

export const MyTreemapComponent = createComponent({
  tagName: 'treemap-component',
  elementClass: TreemapComponent,
  react: React,
});

function App() {
  return (
    <>
      {/* <MyGraphComponent/> */}
      <MyTreemapComponent/>
    </>
  )
}

export default App
