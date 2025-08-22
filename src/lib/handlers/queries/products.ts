const query = `#graphql
  query products($first: Int = 250, $after: String) {
    products(first: $first, after: $after, sortKey: ID, reverse: false) {
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          title
          productType
          vendor
          collections(first: 250) {
            edges {
              node {
                id
                handle
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                sku
                excludeOnline: metafield(namespace: "debut", key: "exclude_variant_online") {
                  id
                  value
                }
                excludedFromDiscounts: metafield(namespace: "suavecito_function", key: "exclude_from_all_discounts") {
                  id
                  value
                }
                price
                compareAtPrice
              }
            }
          }
        }
      }
    }
  }
`;

export default query;
