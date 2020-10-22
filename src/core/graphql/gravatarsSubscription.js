import gql from 'graphql-tag';

export default gql`
  query {
    spatialassets {
      id
      owner
      active
    }
  }
`;
