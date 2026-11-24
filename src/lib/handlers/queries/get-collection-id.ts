const query = `#graphql
  query GetCollectionId($handle: String!) {
    collectionByIdentifier(identifier: {handle: $handle}) {
      id
      handle
    }
  }
`;

export default query;
