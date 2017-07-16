import gql from 'graphql-tag'

// const fragments = {
//   property: gql`
//     fragment PropertyListProperty on Property {
//       id
//       street1
//       street2
//       city
//       state
//     }
//   `
// }

// const PropertyListQuery = gql`
//   query ListProperties($args: PropertyInput, $search: SearchParameters) {
//     listProperties(args: $args, search: $search) {
//       ... PropertyListProperty
//     }
//   }
//   ${fragments.property}
// `

export const Property = {
  attributes: gql`
    fragment PropertyAttributes on Property {
      id
      street1
      street2
      city
      state
    }
  `,
  rooms: gql`
    fragment PropertyRooms on Property {
      rooms {
        ... RoomAttributes
      }
    }
  `
}


export const Room = {
  attributes: gql`
    fragment RoomAttributes on Room {
      id
      name
      price
      description
    }
  `
}

//export const Property
//export const Room
