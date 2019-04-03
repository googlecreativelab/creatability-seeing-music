/**
 * Copyright 2019 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

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

