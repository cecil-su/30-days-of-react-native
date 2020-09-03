import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, Button, FlatList, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {useSetState} from './hooks'

const {width, height} = Dimensions.get('window')

function Head({time}) {
  return (
    <View>
      <Text>{time / 1000 + ''}</Text>
    </View>
  )
}

function Record(props) {
  return (
    <FlatList
      data={props.data}
      keyExtractor={item => item.id + ''}
      renderItem={({item}) => (
        <View style={{alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row'}}>
          <Text>{('0'.repeat(3) + item.id).slice(-3)}</Text>
          <Text>diff: +{item.diff / 1000}</Text>
          <Text>time: {item.time / 1000}</Text>
        </View>  
      )}
    />
  )
}

function Controler(props) {
  const {
    playing = false,
    onPlay,
    onMark
  } = props 

  return (
    <View style={{alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row'}}>
      <Button title={playing ? 'Mark' : 'Stop'} onPress={onMark} />
      <Button title={playing ? 'Pause' : 'Start'} onPress={onPlay} />
    </View>
  )
}

let timer = null
const defaultState = {
  time: 0,
  startTime: 0,
  lastTime: 0,
  playing: false,
  record: []
}

export default function StopWatch() {
  const [state, setState] = useSetState({...defaultState})

  const onPlay = () => {
    if (state.playing) {
      clearInterval(timer)
    } else {
      timer = setInterval(() => {
        setState((st) => ({time: (new Date()).getTime() - st.startTime}))
      }, 10)
    }
    setState({
      playing: !state.playing,
      startTime: state.startTime || (new Date()).getTime(),
      lastTime: (new Date()).getTime()
    })
  }
  
  const onMark = () => {
    const {playing} = state
    if (playing) {
      setState((st) => {
        const len = st.record.length
        const now = Date.now()
        const item = {
          id: len + 1,
          diff: now - st.lastTime,
          time: now - st.startTime,
        }
        return {
          lastTime: now,
          record: [item, ...st.record]
        }
      })
    } else {
      setState({...defaultState})
      clearInterval(timer)
    }
  }

  return (
    <View style={st.container}>
      <Head time={state.time} />
      <Record data={state.record} />
      <Controler playing={state.playing} onPlay={onPlay} onMark={onMark} />
    </View>
  )
}

const st = StyleSheet.create({
  container: {},
})
