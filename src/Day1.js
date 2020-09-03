import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, Button, FlatList, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {useSetState} from './hooks'

const {width, height} = Dimensions.get('window')

function strTime(time) {

}

function Head({time}) {
  return (
    <View>
      <Text>{time / 100 + ''}</Text>
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
          <Text>id: {item.id}</Text>
          <Text>diff: +{item.diff}</Text>
          <Text>time: {item.time}</Text>
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
        setState((st) => ({time: st.time + 1}))
      }, 10)
    }
    setState({
      playing: !state.playing
    })
  }
  
  const onMark = () => {
    const {playing} = state
    if (playing) {
      setState((st) => {
        const len = st.record.length 
        const lastRecord = st.record[0]
        return {
          record: [{id: len + 1, diff: lastRecord ? st.time - lastRecord.time : st.time, time: st.time}, ...st.record]
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
