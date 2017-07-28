import { combineReducers } from 'redux'
import { List, Map, fromJS } from 'immutable'
import { FETCH_LIMIT } from '../Constants'

const initialPropertyState = fromJS({
  selectedItem: {},
  showing: -1,
  buffer: {},
  properties: [],
  args: {},
  searchParameters: {
    sortKey: 'id',
    sortAsc: true,
    searchText: '',
    first: FETCH_LIMIT,
    skip: 0
  }
})

function properties(state = initialPropertyState, action) {
  switch(action.type) {
    case 'SHOW_MORE':
      //return state.update('showing', showing => showing + 1)
      return state.withMutations(st => {
        const showing = st.get('showing')

        st.update('showing', showing => showing + 1)
        const buffer = st.get('buffer')
        console.log("does buffer have ", showing, " ?", buffer.has(showing))
        if (buffer.has(showing)) {
          console.log("adding from buffer at index", showing)
          st.update('properties', properties => properties.concat(buffer.get(showing)))
          buffer.delete(showing)
        }
      })
    case 'FETCH_ENTITIES':
      return state.withMutations(st => {
        st.update('searchParameters', searchParameters => searchParameters.merge(action.searchParameters))
          .update('args', args => args.merge(action.args))
      })
    case 'FETCH_ENTITIES_SUCCESS':
      console.log("in success: action", action.batchIndex)
      console.log("properties.count", state.get('properties').count(), ", should be", (state.get('showing') - 1) * FETCH_LIMIT)
      if (state.get('properties').count() !== (state.get('showing') - 1) * FETCH_LIMIT) {
        console.log("setting ", action.batchIndex, "'s entities to the buffer'")
        // this batch of properties should go into the buffer, because we have
        // not yet received the properties that are ordered before it
        return state.update('buffer', buffer => buffer.set(action.batchIndex, List(action.entities)))
      }

      return state.withMutations(st => {
        console.log('pushing entities from batch', action.batchIndex, ' onto properties')
        // add the fetched batch to properties
        st.update('properties', properties => {
          //console.log("xxxxx")
          return properties.concat(action.entities)
        })

        // add any properties stuck in the buffer
        // let i = action.batchIndex + 1
        //const showing = st.get('showing')
        //const buffer = st.get('buffer')

        // for(var i = action.batchIndex + 1;i < showing;++i) {
        //   if (!buffer.has(i)) continue
        //   console.log("adding from buffer at index", i)
        //   st.update('properties', properties => properties.concat(buffer.get(i)))
        //   buffer.delete(i)
        // }
        // while(buffer.has(i)) {
        //   console.log("adding from buffer at index", i)
        //   st.update('properties', properties => {
        //     return properties
        //       .set(action.batchIndex * FETCH_LIMIT)
        //       .splice(action.batchIndex * FETCH_LIMIT, FETCH_LIMIT, ...buffer.get(i))
        //   })
        //
        //   console.log(st.get('properties'))
        //   buffer.delete(i)
        //   ++i
        // }
      })
      // return state.update('properties', properties => {
      //   if (action.batchIndex * FETCH_LIMIT > properties.size()) {
      //     return properties
      //   }
      //   return properties
      //     .set(action.batchIndex * FETCH_LIMIT)
      //     .splice(action.batchIndex * FETCH_LIMIT, FETCH_LIMIT, ...action.entities)
      // })
    case 'FETCH_ENTITY_DETAILS_SUCCESS':
      return state.set('selectedItem', Map(action.entity))
    default:
      return state
  }
}

export default combineReducers({
  Property: properties
})
