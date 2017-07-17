import gql from 'graphql-tag'

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
