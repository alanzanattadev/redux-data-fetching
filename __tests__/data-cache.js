import reducer from '../lib/graphql-data-reducer';

describe('reducer', () => {
  describe('Differents types resources merging', () => {
    it('should differientates users and providers', () => {
      let result = reducer({
        users: [{
          id: "1",
          name: "Mark",
          age: 20,
          friends: [{
            id: "1"
          }]
        }],
        credentials: {
          token: "salut"
        },
        requestHistory: [{
          id: "0",
          method: "get"
        }, {
          id: "1",
          method: "post"
        }]
      }, {
        type: "GRAPHQL_DATA_RECEIVED",
        payload: {
          users: [{
            id: "0",
            name: "Alan"
          }, {
            id: "1",
            name: "Mark",
            friends: [{
              id: "0"
            }]
          }],
          providers: [{
            id: "0",
            name: "Facebook"
          }, {
            id: "1",
            name: "Google"
          }],
          profile: {
            roles: ["admin"]
          }
        }
      });
      expect(result).toEqual({
        users: [{
          id: "1",
          name: "Mark",
          age: 20,
          friends: [{
            id: "1"
          }]
        }, {
          id: "0",
          name: "Alan"
        }],
        credentials: {
          token: "salut"
        },
        requestHistory: [{
          id: "0",
          method: "get"
        }, {
          id: "1",
          method: "post"
        }],
        providers: [{
          id: "0",
          name: "Facebook"
        }, {
          id: "1",
          name: "Google"
        }],
        profile: {
          roles: ["admin"]
        }
      });
    });
  });
});
