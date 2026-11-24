/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type CollectionByIdentifierQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
  cursor?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type CollectionByIdentifierQuery = { collectionByIdentifier?: AdminTypes.Maybe<(
    Pick<AdminTypes.Collection, 'id' | 'handle'>
    & { products: { pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'startCursor' | 'hasNextPage' | 'hasPreviousPage'>, edges: Array<{ node: (
          Pick<AdminTypes.Product, 'id' | 'title' | 'productType' | 'vendor'>
          & { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'handle'> }> }, variants: { pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'startCursor' | 'hasNextPage' | 'hasPreviousPage'>, edges: Array<{ node: (
                Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'price' | 'compareAtPrice'>
                & { excludeOnline?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>>, excludedFromDiscounts?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
              ) }> } }
        ) }> } }
  )> };

export type GetCollectionIdQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
}>;


export type GetCollectionIdQuery = { collectionByIdentifier?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id' | 'handle'>> };

export type ProductsQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ProductsQuery = { products: { pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'startCursor' | 'hasNextPage' | 'hasPreviousPage'>, edges: Array<{ node: (
        Pick<AdminTypes.Product, 'id' | 'title' | 'productType' | 'vendor'>
        & { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'handle'> }> }, variants: { edges: Array<{ node: (
              Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'price' | 'compareAtPrice'>
              & { excludeOnline?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>>, excludedFromDiscounts?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
            ) }> } }
      ) }> } };

export type VariantCollectionQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
  collectionId: AdminTypes.Scalars['ID']['input'];
  cursor?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type VariantCollectionQuery = { collectionByIdentifier?: AdminTypes.Maybe<(
    Pick<AdminTypes.Collection, 'id' | 'handle'>
    & { products: { pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'startCursor' | 'hasNextPage' | 'hasPreviousPage'>, edges: Array<{ node: (
          Pick<AdminTypes.Product, 'id' | 'title' | 'productType' | 'vendor'>
          & { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'handle'> }> }, variants?: AdminTypes.Maybe<{ pageInfo: Pick<AdminTypes.PageInfo, 'endCursor' | 'startCursor' | 'hasNextPage' | 'hasPreviousPage'>, edges: Array<{ node: (
                Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'price' | 'compareAtPrice'>
                & { excludeOnline?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>>, excludedFromDiscounts?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
              ) }> }> }
        ) }> } }
  )> };

interface GeneratedQueryTypes {
  "#graphql\n  query CollectionByIdentifier($handle: String!, $cursor: String) {\n    collectionByIdentifier(identifier: {handle: $handle}) {\n      id\n      handle\n      products(first: 250, after: $cursor, sortKey: ID, reverse: false) {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          node {\n            id\n            title\n            productType\n            vendor\n            collections(first: 250) {\n              edges {\n                node {\n                  id\n                  handle\n                }\n              }\n            }\n            variants(first: 250) {\n              pageInfo {\n                endCursor\n                startCursor\n                hasNextPage\n                hasPreviousPage\n              }\n              edges {\n                node {\n                  id\n                  sku\n                  excludeOnline: metafield(namespace: \"debut\", key: \"exclude_variant_online\") {\n                    id\n                    value\n                  }\n                  excludedFromDiscounts: metafield(\n                    namespace: \"suavecito_function\"\n                    key: \"exclude_from_all_discounts\"\n                  ) {\n                    id\n                    value\n                  }\n                  price\n                  compareAtPrice\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: CollectionByIdentifierQuery, variables: CollectionByIdentifierQueryVariables},
  "#graphql\n  query GetCollectionId($handle: String!) {\n    collectionByIdentifier(identifier: {handle: $handle}) {\n      id\n      handle\n    }\n  }\n": {return: GetCollectionIdQuery, variables: GetCollectionIdQueryVariables},
  "#graphql\n  query products($first: Int = 250, $after: String) {\n    products(first: $first, after: $after, sortKey: ID, reverse: false) {\n      pageInfo {\n        endCursor\n        startCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          id\n          title\n          productType\n          vendor\n          collections(first: 250) {\n            edges {\n              node {\n                id\n                handle\n              }\n            }\n          }\n          variants(first: 250) {\n            edges {\n              node {\n                id\n                sku\n                excludeOnline: metafield(namespace: \"debut\", key: \"exclude_variant_online\") {\n                  id\n                  value\n                }\n                excludedFromDiscounts: metafield(namespace: \"suavecito_function\", key: \"exclude_from_all_discounts\") {\n                  id\n                  value\n                }\n                price\n                compareAtPrice\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: ProductsQuery, variables: ProductsQueryVariables},
  "#graphql\n  query VariantCollection($handle: String!, $collectionId: ID!, $cursor: String) {\n    collectionByIdentifier(identifier: {handle: $handle}) {\n      id\n      handle\n      products(first: 250, after: $cursor, sortKey: ID, reverse: false) {\n        pageInfo {\n          endCursor\n          startCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          node {\n            id\n            title\n            productType\n            vendor\n            collections(first: 250) {\n              edges {\n                node {\n                  id\n                  handle\n                }\n              }\n            }\n            variants: variantsInCollection(collectionId: $collectionId, first: 250) {\n              pageInfo {\n                endCursor\n                startCursor\n                hasNextPage\n                hasPreviousPage\n              }\n              edges {\n                node {\n                  id\n                  sku\n                  excludeOnline: metafield(namespace: \"debut\", key: \"exclude_variant_online\") {\n                    id\n                    value\n                  }\n                  excludedFromDiscounts: metafield(\n                    namespace: \"suavecito_function\"\n                    key: \"exclude_from_all_discounts\"\n                  ) {\n                    id\n                    value\n                  }\n                  price\n                  compareAtPrice\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: VariantCollectionQuery, variables: VariantCollectionQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
