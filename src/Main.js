import './style.scss'
import { Sidebar } from './interface/Sidebar'
import { initializeVisualizations } from './Visualizations'
import './Visibility'

//the sidebar
const sidebar = new Sidebar()

//connect the sidebar output to the analyser
import { Analyser } from './tools/Analyser'
const source = new Analyser(sidebar.audio)
sidebar.model.notes = source.polyphonic

sidebar.initialize()
initializeVisualizations(sidebar, source)

