const { gql } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');

const { ApolloServer, typeDefs, resolvers } = require('../../app');
const models = require('../../db/models');
const testUtils = require('../utils');

describe('Test finance queries', () => {
  let user = null;
  let testQuery = null;
  let testMutate = null;

  beforeEach(async done => {
    await testUtils.truncateFinanceTables();
    user = await testUtils.createUser('dwight', 'password');
    const context = ({}) => {
      return {
        UserId: user.id,
        models,
      };
    };
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
    });

    let { query, mutate } = createTestClient(server);
    testQuery = query;
    testMutate = mutate;
    done();
  });

  describe('Test categories & subcategories', () => {
    test('Get categories only includes yours and public', async done => {
      // GIVEN
      // the other user we will be testing with
      let otherUser = await testUtils.createUser('keanu', 'password');
      // Create a public category, and a private for each user
      let publicCategory = await testUtils.createFinanceCategory(
        null,
        'zzzzzzzzz'
      );
      let privateCategory = await testUtils.createFinanceCategory(
        user.id,
        'mycategory'
      );
      await testUtils.createFinanceCategory(otherUser.id, 'keanus');
      // Create the same for sub categories under the public category
      let publicSubCategory = await testUtils.createFinanceSubCategory(
        publicCategory.id,
        null,
        'zzzzzzz'
      );
      let privateSubCategory = await testUtils.createFinanceSubCategory(
        publicCategory.id,
        user.id,
        'mySub'
      );
      let otherSubCategory = await testUtils.createFinanceSubCategory(
        publicCategory.id,
        otherUser.id,
        'otherSub'
      );

      // WHEN
      let res = await testQuery({
        query: GET_CATEGORIES_WITH_SUB_AND_USER,
      });
      let categories = res.data.getCategories;

      // THEN
      // Should not have the other users category
      expect(categories.length).toEqual(2);
      // Sorts by name so first is privateCategory
      expect(categories[0].id).toEqual(privateCategory.id);
      expect(categories[0].user.username).toEqual(user.username);
      // Second is the public category
      expect(categories[1].id).toEqual(publicCategory.id);
      // It should not contain the other users sub category
      expect(categories[1].subCategories.length).toEqual(2);
      // Sub categories are sorted by name as well so first is the privateSubCategory
      expect(categories[1].subCategories[0].id).toEqual(privateSubCategory.id);
      expect(categories[1].subCategories[1].id).toEqual(publicSubCategory.id);
      done();
    });
  });
});

const GET_CATEGORIES_WITH_SUB_AND_USER = gql`
  query {
    getCategories {
      id
      name
      user {
        username
      }
      subCategories {
        id
        name
        user {
          username
        }
      }
    }
  }
`;
